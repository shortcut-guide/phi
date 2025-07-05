import { useState } from "react";
import { Media, Modal, Pagination } from "accessible-astro-components";
import DefaultLayout from "@/f/layouts/DefaultLayout";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const MediaPage = ({ lang }: Props) => {
  const [modalOpen, setModalOpen] = useState(false);
  const t = (messages.mediaPage as any)[lang] ?? {};

  return (
    <DefaultLayout title={t.title}>
      <section>
        <h1>{t.heading}</h1>
        <br />
        <p className="size-20">{t.overview}</p>
      </section>
      <section className="margin-32">
        <div className="space-content">
          <div className="contents">
            <h2>{t.sectionTitle}</h2>
            <p>
              <em>{t.resultInfo}</em>
            </p>
          </div>
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
          <div className="grid small-grid-1 medium-grid-2 large-grid-3 equal-height">
            <Media
              classes="media radius-large elevation-400"
              src="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2344&q=80"
            />
            <Media
              classes="media radius-large elevation-400"
              src="https://images.unsplash.com/photo-1608178398319-48f814d0750c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1758&q=80"
            />
            <Media
              classes="media radius-large elevation-400"
              src="https://images.unsplash.com/photo-1454789548928-9efd52dc4031?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"
            />
            <Media
              classes="media radius-large elevation-400"
              src="https://images.unsplash.com/photo-1590907047706-ee9c08cf3189?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"
            />
            <Media
              classes="media radius-large elevation-400"
              src="https://images.unsplash.com/photo-1446941611757-91d2c3bd3d45?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1402&q=80"
            />
            <Media
              classes="media rad
