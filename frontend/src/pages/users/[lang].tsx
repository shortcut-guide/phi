import { useState } from 'react';
import Modal from 'accessible-astro-components/Modal'; // Modalの正確なパスは要調整
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
    <DefaultLayout title="Users">
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
          <Modal
            open={modalOpen}
            onClose={() => setModalOpen(false)}
            title="Add user"
            closeText="Cancel"
            triggerId="modal-trigger"
          >
            <p>You can use this component to include a form that adds a new user to the list.</p>
          </Modal>
        </div>
      </section>
    </DefaultLayout>
  );
};

export default UsersPage;
