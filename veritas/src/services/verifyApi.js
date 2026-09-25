const WEBHOOK_URL = "http://localhost:5000/api/chat";

const MAX_SIDE = 1600;
const JPEG_QUALITY = 0.85;

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */

/** Read a File/Blob as a Base64 data URL */
export const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(reader.result);

    reader.onerror = () =>
      reject(new Error('Could not read the image file.'));

    reader.readAsDataURL(file);
  });


/**
 * Resize large images before sending them to n8n.
 * GIF and SVG are kept unchanged.
 */
export async function prepareImage(file) {
  const original = await fileToDataUrl(file);

  if (
    !file.type?.startsWith('image/') ||
    /gif|svg/i.test(file.type || '')
  ) {
    return original;
  }

  return new Promise((resolve) => {
    const img = new Image();

    img.onload = () => {
      const largestSide = Math.max(img.width, img.height);

      const scale = Math.min(
        1,
        MAX_SIDE / largestSide
      );

      // Already small enough
      if (
        scale === 1 &&
        file.size < 1.5 * 1024 * 1024
      ) {
        resolve(original);
        return;
      }

      const canvas = document.createElement('canvas');

      canvas.width = Math.max(
        1,
        Math.round(img.width * scale)
      );

      canvas.height = Math.max(
        1,
        Math.round(img.height * scale)
      );

      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve(original);
        return;
      }

      // White background for transparent images
      ctx.fillStyle = '#fff';
      ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      ctx.drawImage(
        img,
        0,
        0,
        canvas.width,
        canvas.height
      );

      resolve(
        canvas.toDataURL(
          'image/jpeg',
          JPEG_QUALITY
        )
      );
    };

    img.onerror = () => {
      resolve(original);
    };

    img.src = original;
  });
}


/* -------------------------------------------------------
   Response normalization
------------------------------------------------------- */

/* -------------------------------------------------------
   Response normalization
------------------------------------------------------- */

function normalize(data) {
  const text =
    data?.response ||
    data?.answer ||
    data?.message ||
    data?.reply ||
    '';

  const isClaim =
    data?.type === 'claim' ||
    (!!data?.verdict && data?.type !== 'chat');

  const rawSources = Array.isArray(data?.sources)
    ? data.sources
    : [];

  const evidence = rawSources
  .filter(Boolean)
  .map((source, index) => {
    const url =
      typeof source === 'string'
        ? source
        : source?.url || source?.link || '';

    let host = '';

    try {
      host = new URL(url).hostname.replace(/^www\./, '');
    } catch {
      host = url;
    }

    return {
      id: `source-${index}`,
      url,
      title: host,
      source: host,
    };
  });

  return {
    kind: isClaim ? 'verdict' : 'chat',

    text,

    explanation:
      data?.explanation || text,

    verdict:
      data?.verdict || null,

    actualInformation:
      data?.actual_information ||
      data?.actualInformation ||
      '',

    confidence:
      data?.confidence || null,

    sources: rawSources,

    evidence,

    claim:
      data?.claim || '',

    fromImage:
      !!(
        data?.from_image ||
        data?.fromImage
      ),

    extractedClaim:
      data?.extracted_claim ||
      data?.extractedClaim ||
      '',

    raw: data,
  };
}

/* -------------------------------------------------------
   VERIFY CONTENT
------------------------------------------------------- */

/**
 * Verify text or image through the backend.
 *
 * Text:
 *   { type: 'text', content: '...' }
 *
 * Image:
 *   { type: 'image', content: 'data:image/png;base64,...' }
 */
export async function verifyContent({
  type,
  content,
  signal,
}) {
  if (!type) {
    throw new Error('Verification type is required.');
  }

  if (!content) {
    throw new Error('Verification content is required.');
  }

  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 90000);

  // If caller supplied an AbortSignal,
  // forward its abort to our controller.
  let abortHandler;

  if (signal) {
    abortHandler = () => controller.abort();

    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener(
        'abort',
        abortHandler,
        { once: true }
      );
    }
  }

  try {
    const response = await fetch('/api/verify', {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        type,
        content,
      }),

      signal: controller.signal,
    });

    if (!response.ok) {
      let message = `Server error (${response.status}).`;

      try {
        const errorData = await response.json();

        message =
          errorData?.message ||
          errorData?.error ||
          message;
      } catch {
        // Keep default message
      }

      throw new Error(message);
    }

    const data = await response.json();

    return normalize(data);

  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(
        'The request timed out. Please try again.'
      );
    }

    throw error;

  } finally {
    clearTimeout(timeout);

    if (signal && abortHandler) {
      signal.removeEventListener(
        'abort',
        abortHandler
      );
    }
  }
}


/* -------------------------------------------------------
   CHAT MESSAGE
------------------------------------------------------- */

/**
 * Send a chat message to n8n.
 *
 * image can be:
 * - File
 * - Blob
 * - Base64/data URL
 * - http/https URL
 */
export async function sendChatMessage({
  message = '',
  conversation = [],
  image = null,
  mode = 'chat',
  source = 'home',
}) {
  let imagePayload = '';

  /* -----------------------------------------------
     Convert actual File → Base64 data URL
  ------------------------------------------------ */

  if (
    image instanceof File ||
    image instanceof Blob
  ) {
    imagePayload = await prepareImage(image);
  }

  /* -----------------------------------------------
     Already a data URL / URL
  ------------------------------------------------ */

  else if (
    typeof image === 'string' &&
    image.trim()
  ) {
    imagePayload = image.trim();
  }

  /* -----------------------------------------------
     Build payload
  ------------------------------------------------ */

  const payload = {
    mode,
    source,
    message,
    conversation,
  };

  /*
   * IMPORTANT:
   * Send the same image under both names so the
   * current n8n workflow can recognize it while
   * we transition to imageDataUrl.
   */
  if (imagePayload) {
    payload.imageDataUrl = imagePayload;
    payload.image = imagePayload;
  }

  const controller = new AbortController();

  const timer = setTimeout(() => {
    controller.abort();
  }, 90000);

  try {
    const response = await fetch(
      WEBHOOK_URL,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify(payload),

        signal: controller.signal,
      }
    );

    if (!response.ok) {
      let message =
        `Server error (${response.status}). Please try again.`;

      try {
        const errorData =
          await response.json();

        message =
          errorData?.message ||
          errorData?.error ||
          message;

      } catch {
        // Keep default error
      }

      throw new Error(message);
    }

    const data = await response.json();

    return normalize(data);

  } catch (error) {
    if (error?.name === 'AbortError') {
      throw new Error(
        'The request timed out. Please try again.'
      );
    }

    throw error;

  } finally {
    clearTimeout(timer);
  }
}