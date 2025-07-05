import { useState } from 'react';
import Modal from 'accessible-astro-components/Modal'; // パスはプロジェクトに合わせて調整
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
    <DefaultLayout title={t.title}>
      <section>
        <h1>{t.heading}</h1>
        <br />
        <p className="size-20">{t.overview}</p>
      </section>
      <section className="margin-32">
        <div className="space-content">
          <h2>{t.sectionTitle}</h2>
          <EmptyState>{t.emptyMessage}</EmptyState>
          <button
            id="modal-trigger"
            className="button color-secondary"
            onClick={() => setModalOpen(true)}
          >
            {t.addButton}
          </button>
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title={t.modalTitle}
            closeText={t.modalCloseText}
            triggerId="modal-trigger"
          >
            <p>{t.modalBody}</p>
          </Modal>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default MessagesPage;
