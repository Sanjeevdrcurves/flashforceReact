import { KeenIcon } from '@/components';
import { CrudAvatarUpload } from '@/partials/crud';
const PersonalInfo = () => {
  return <div className="card min-w-full">
      <div className="card-header">
        <h3 className="card-title">Personal Info</h3>
      </div>
      <div className="card-table scrollable-x-auto pb-3">
        <table className="table align-middle text-sm text-gray-500">
          <tbody>
            <tr>
              <td className="py-2 min-w-28 text-gray-600 font-normal">Photo</td>
              <td className="py-2 text-gray700 font-normal min-w-32 text-2sm">
                150x150px JPEG, PNG Image
              </td>
              <td className="py-2 text-center">
                <div className="flex justify-center items-center">
                  <CrudAvatarUpload />
                </div>
              </td>
            </tr>
            <tr>
              <td className="py-2 text-gray-600 font-normal">Name</td>
              <td className="py-2 text-gray-800 font-normaltext-sm"> <input className="input" type="text" value="Jason Tatum" /></td>
              <td className="py-2 text-center">
                <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a>
              </td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">Availability</td>
              <td className="py-3 text-gray-800 font-normal">
              <input className="input" type="text" value="Available now" />
              
              </td>
              <td className="py-3 text-center">
                <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a>
              </td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">Birthday</td>
              <td className="py-3 text-gray-700 text-sm font-normal"><input className="input" type="date" value="Available now" /></td>
              <td className="py-3 text-center">
                <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a>
              </td>
            </tr>
            <tr>
              <td className="py-3 text-gray-600 font-normal">Gender</td>
              <td className="py-3 text-gray-700 text-sm font-normal"><input className="input" type="text" value="Male" /></td>
              <td className="py-3 text-center">
                <a href="#" className="btn btn-sm btn-icon btn-clear btn-primary">
                  <KeenIcon icon="notepad-edit" />
                </a>
              </td>
            </tr>
            <tr>
              <td className="py-3">Address</td>
              <td className="py-3 text-gray-700 text-2sm font-normal">
                <input className="input" type="text" value="You have no an address yet" />
              </td>
              <td className="py-3 text-center">
                <a href="#" className="btn btn-link btn-sm">
                  Add
                </a>
              </td>
            </tr>
              <tr>
              <td colspan="3">
              <div class="flex justify-end"><button class="btn btn-primary">Save Changes</button></div></td></tr>
          </tbody>
        </table>
      </div>
    </div>;
};
export { PersonalInfo };