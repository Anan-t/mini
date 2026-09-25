import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryList from '../components/history/HistoryList';
import ResultCard from '../components/result/ResultCard';
import Button from '../components/ui/Button';
import { useHistory } from '../context/HistoryContext';

export default function History() {
  const { entries, removeEntry, clearHistory } = useHistory();
  const [selected, setSelected] = useState(null);
  const navigate = useNavigate();

  const open = (entry) => setSelected((current) => (current?.id === entry.id ? null : entry));

  const remove = (id) => {
    removeEntry(id);
    setSelected((current) => (current?.id === id ? null : current));
  };

  return (
    <div className="mx-auto w-full max-w-2xl px-5 pb-16 pt-10">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-frost">History</h1>
          <p className="mt-1.5 text-sm text-mist">
            {entries.length > 0
              ? 'Saved on this device only. Select one to reopen its verdict.'
              : 'Checks you run are kept here on this device.'}
          </p>
        </div>
        {entries.length > 0 && (
          <Button variant="danger" size="sm" onClick={clearHistory}>
            Clear all
          </Button>
        )}
      </header>

      {selected && (
        <div className="mb-6">
          <ResultCard
            result={selected.result}
            query={{ preview: selected.preview, type: selected.type }}
            onReset={() => setSelected(null)}
          />
        </div>
      )}

      <HistoryList
        entries={entries}
        onOpen={open}
        onRemove={remove}
        emptyAction={
          <Button size="sm" className="mt-2" onClick={() => navigate('/verify')}>
            Check a claim
          </Button>
        }
      />
    </div>
  );
}
