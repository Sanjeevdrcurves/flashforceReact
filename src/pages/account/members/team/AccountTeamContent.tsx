import { MiscFaq, MiscHelp2 } from '@/partials/misc';

import { Team } from './blocks';

const AccountTeamContent = () => {
  return (
    <div className="grid gap-5 lg:gap-7.5">
      <Team />

      <MiscFaq />

      <MiscHelp2 />
    </div>
  );
};

export { AccountTeamContent };
