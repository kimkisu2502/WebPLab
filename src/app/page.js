
import db from '@/db';
import profile from '@/assets/profile.jpg';
import { useAuth } from '@/components/context/AuthContext';
import Root from '@/components/ui/Root';

export default async function Home({ searchParams }) {  

  return (
    <Root defaultProfile={profile}
>
    </Root>
  );
}