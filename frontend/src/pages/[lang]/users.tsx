import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import DefaultLayout from '@/f/layouts/DefaultLayout'; // .astro→.tsxなどに修正
import EmptyState from '@/f/components/EmptyState';
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const UsersPage = ({ lang }: Props) => {
  const t = (messages.users as any)[lang] ?? {};
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <DefaultLayout lang={lang} title={t.title}>
      <section>
        <h1>{t.title}</h1>
        <br />
        <p className="size-20">Lorem ipsum dolor sit amet.</p>
      </section>
      <section className="margin-32">
        <div className="space-content">
          <h2>{t.overview}</h2>
          <EmptyState>
            {t.emptyMessage}
          </EmptyState>
          <button
            id="modal-trigger"
            className="button color-secondary"
            onClick={() => setModalOpen(true)}
          >
            {t.addButton}
          </button>
          <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
              <div className="relative bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-auto">
                <h2 className="text-lg font-bold mb-4">Add user</h2>
                <p className="mb-4">
                  You can use this component to include a form that adds a new user to the list.
                </p>
                <button className="button" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </Dialog>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default UsersPage;
