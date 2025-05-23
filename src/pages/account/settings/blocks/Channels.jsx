import { CardNotification } from '@/partials/cards';
const Channels = () => {
  const items = [{
    icon: 'sms',
    title: 'Email',
    description: 'Tailor Your Email Preferences.',
    button: true,
    actions: <div className="switch switch-sm">
          <input type="checkbox" name="param" defaultChecked value="1" readOnly />
        </div>
  }, {
    icon: 'phone',
    title: 'Mobile',
    description: '(225) 555-0118',
    button: true,
    actions: <div className="switch switch-sm">
          <input type="checkbox" name="param" value="1" readOnly />
        </div>
  }, {
    icon: 'slack',
    title: 'Slack',
    description: 'Receive instant alerts for messages and updates directly in Slack.',
    actions: <a href="#" className="btn btn-sm btn-light btn-outline text-center">
          Connect Slack
        </a>
  }, {
    icon: 'screen',
    title: 'Desctop',
    description: 'Enable notifications for real-time desktop alerts.',
    actions: <div className="switch switch-sm">
          <input type="checkbox" name="param" defaultChecked value="1" readOnly />
        </div>
  }];
  const renderItem = (item, index) => {
    return <CardNotification icon={item.icon} title={item.title} description={item.description} button={item.button} actions={item.actions} key={index} />;
  };
  return <div className="card">
      <div className="card-header gap-2">
        <h3 className="card-title">Notification </h3>

        
      </div>

      <div id="notifications_cards">
        {items.map((item, index) => {
        return renderItem(item, index);
      })}
      </div>
    </div>;
};
export { Channels };