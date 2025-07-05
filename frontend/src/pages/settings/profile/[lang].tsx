import ProfileForm from "@/f/components/ProfileForm";
import { messages } from "@/f/config/messageConfig";

type Props = {
  lang: string;
};

const ProfilePage = ({ lang }: Props) => {
  const t = (messages.profilePage as any)[lang] ?? {};

  return (
    <div>
      <h1 className="text-xl font-bold">{t.title}</h1>
      <ProfileForm />
    </div>
  );
};

export default ProfilePage;
