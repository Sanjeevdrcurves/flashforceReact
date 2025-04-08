import { useState } from 'react';
import { KeenIcon } from '@/components';
import { CrudAvatarUpload } from '@/partials/crud';

const TeamInfo = () => {
  const [teamInfo, setTeamInfo] = useState({
    teamName: 'Product Management',
    description: "We're open to partnerships, guest posts, and more. Join us to share your insights and grow your audience.",
    isPublic: true,
    imageUrl: '',
    imageName: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setTeamInfo({
      ...teamInfo,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (image) => {
    setTeamInfo({
      ...teamInfo,
      imageUrl: image.url,
      imageName: image.name
    });
  };

  return (
    <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">Edit Team Info</h3>

        <label className="switch switch-sm">
          <input
            name="isPublic"
            type="checkbox"
            checked={teamInfo.isPublic}
            onChange={handleChange}
            className="order-2"
          />
          <span className="switch-label order-1">Visible to all</span>
        </label>
      </div>

      <div className="card-body">
        <div className="mb-4">
          <label className="block text-gray-600 font-normal">Thumbnail</label>
          <CrudAvatarUpload onUpload={handleImageUpload} />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-normal">Team Name</label>
          <input
            type="text"
            name="teamName"
            value={teamInfo.teamName}
            onChange={handleChange}
            className="input w-full"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-normal">Description</label>
          <textarea
            name="description"
            value={teamInfo.description}
            onChange={handleChange}
            className="input w-full"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 font-normal">View as</label>
          <span className={`badge badge-sm ${teamInfo.isPublic ? 'badge-success' : 'badge-secondary'}`}>
            {teamInfo.isPublic ? 'Public' : 'Private'}
          </span>
        </div>

        <button className="btn btn-primary w-full">Save Changes</button>
      </div>
    </div>
  );
};

export { TeamInfo };
