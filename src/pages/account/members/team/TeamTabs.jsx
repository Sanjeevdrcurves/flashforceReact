import React, { useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css"; // React-tabs default styles
import TeamGeneralForm from "./TeamGeneralForm";
import TeamMembers from "./TeamMembers";
import TeamDistribution from "./TeamDistribution";

const TeamTabs = ({ selectedTeam, onSave, onClose, loadAllTeams }) => {
  const [team, setTeam] = useState(
    selectedTeam || {
      id: null,
      name: "",
      type: "",
      description: "",
      email: "marketing-team@example.com",
      phoneNo: "+1 (555) 987-6543",
      leader: "",
      members: [],
      distributionType: "even",
      weights: {},
      channel: "",
    }
  );

  const [activeTab, setActiveTab] = useState(0);

  return (
    <Tabs selectedIndex={activeTab} onSelect={() => {}}>
      <TabList>
        <Tab>General</Tab>
        <Tab>Members</Tab>
        <Tab>Distribution</Tab>
      </TabList>

      {/* General Tab */}
      <TabPanel>
        <TeamGeneralForm
          team={team}
          setTeam={setTeam}
          setActiveTab={setActiveTab}
          onCancel={onClose}
        />
      </TabPanel>

      {/* Members Tab */}
      <TabPanel>
        <TeamMembers team={team} setTeam={setTeam} setActiveTab={setActiveTab} />
      </TabPanel>

      {/* Distribution Tab */}
      <TabPanel>
        <TeamDistribution
          team={team}
          setTeam={setTeam}
          setActiveTab={setActiveTab}
          onClose={onClose}
          loadAllTeams={loadAllTeams}
        />
      </TabPanel>
    </Tabs>
  );
};

export default TeamTabs;
