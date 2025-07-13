import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import DefaultLayout from '@/f/layouts/DefaultLayout';
import EmptyState from '@/f/components/EmptyState';
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const MessagesPage = ({ lang }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const t = (messages.messagesPage as any)[lang] ?? {};

  return (
    <DefaultLayout lang={lang} title={t.title}>
      <section>
        <h1>{t.heading}</h1>
        <p className="size-20">{t.overview}</p>
      </section>
      <section className="margin-32">
        <div className="space-content">
          <h2>{t.sectionTitle}</h2>
          <EmptyState>{t.emptyMessage}</EmptyState>
          <button id="modal-trigger" className="button color-secondary" onClick={() => setModalOpen(true)}>{t.addButton}</button>

          <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="fixed inset-0 z-10 flex items-center justify-center" aria-labelledby="modal-title" aria-describedby="modal-description">
            <div className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />
            <div className="bg-white rounded max-w-sm mx-auto p-6 z-20" role="dialog" aria-modal="true" aria-labelledby="modal-title" aria-describedby="modal-description">
              <h2 id="modal-title" className="text-lg font-medium">{t.modalTitle}</h2>
              <p id="modal-description" className="mt-2 mb-4">{t.modalBody}</p>
              <button className="button color-secondary" onClick={() => setModalOpen(false)}>{t.modalCloseText}</button>
            </div>
          </Dialog>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default MessagesPage;
