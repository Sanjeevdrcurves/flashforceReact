import { useRef, useState } from 'react';
import { KeenIcon } from '@/components/keenicons';
import { toAbsoluteUrl } from '@/utils';
import { Menu, MenuItem, MenuToggle } from '@/components';
import { DropdownUser } from '@/partials/dropdowns/user';
import { DropdownNotifications } from '@/partials/dropdowns/notifications';
import { DropdownApps } from '@/partials/dropdowns/apps';
import { DropdownChat } from '@/partials/dropdowns/chat';
import { ModalSearch } from '@/partials/modals/search/ModalSearch';
import { useLanguage } from '@/i18n';
import { AccountSettingsModal } from '../../../pages/account/home/settings-modal';
import { useSelector } from 'react-redux';
import TwilioInboundCallHandler from   '../../../pages/drcurves/TwilioCallHandler';
import { Modal } from '@/components/Modal'; // Reusable Modal component


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

const HeaderTopbar = () => {
  const[settingModal,setsettingModal]=useState(false)
  
  const [twilioModalOpen, setTwilioModalOpen] = useState(false);
   // 2) Callback triggered by TwilioInboundCallHandler
   const handleIncomingCall = () => {
    // automatically open the modal
    setTwilioModalOpen(true);
  };

  const user=useSelector(state=>state.AuthReducerKey);

  const {
    isRTL
  } = useLanguage();
  const itemChatRef = useRef(null);
  const itemAppsRef = useRef(null);
  const itemUserRef = useRef(null);
  const itemNotificationsRef = useRef(null);
  const handleShow = () => {
    window.dispatchEvent(new Event('resize'));
  };

  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const handleOpen = () => setSearchModalOpen(true);
  const handleClose = () => {
    setSearchModalOpen(false);
  };


  
  return <div className="flex items-center gap-2 lg:gap-3.5">


 {/* (A) The phone icon to manually open Twilio modal */}
 <button
        onClick={() => setTwilioModalOpen(true)}
        className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500"
      >
        <KeenIcon icon="phone" />
      </button>

      {/* (B) The Twilio modal that appears on incoming call or user click */}
      <TwilioInboundCallHandler onIncomingCall={setTwilioModalOpen} incoming={twilioModalOpen} />
   
      <button onClick={handleOpen} className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary text-gray-500">
        <KeenIcon icon="magnifier" />
      </button>
      <ModalSearch open={searchModalOpen} onOpenChange={handleClose} />

      <Menu>
        <MenuItem ref={itemChatRef} onShow={handleShow} toggle="dropdown" trigger="click" dropdownProps={{
        placement: isRTL() ? 'bottom-start' : 'bottom-end',
        modifiers: [{
          name: 'offset',
          options: {
            offset: isRTL() ? [-170, 10] : [170, 10]
          }
        }]
      }}>
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="messages" />
          </MenuToggle>

          {DropdownChat({
          menuTtemRef: itemChatRef
        })}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem ref={itemAppsRef} toggle="dropdown" trigger="click" dropdownProps={{
        placement: isRTL() ? 'bottom-start' : 'bottom-end',
        modifiers: [{
          name: 'offset',
          options: {
            offset: isRTL() ? [-10, 10] : [10, 10]
          }
        }]
      }}>
          <MenuToggle className="btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="element-11" />
          </MenuToggle>

          {DropdownApps()}
        </MenuItem>
      </Menu>

      <Menu>
        <MenuItem ref={itemNotificationsRef} toggle="dropdown" trigger="click" dropdownProps={{
        placement: isRTL() ? 'bottom-start' : 'bottom-end',
        modifiers: [{
          name: 'offset',
          options: {
            offset: isRTL() ? [-70, 10] : [70, 10] // [skid, distance]
          }
        }]
      }}>
          <MenuToggle className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
            <KeenIcon icon="notification-status" />
          </MenuToggle>
          {DropdownNotifications({
          menuTtemRef: itemNotificationsRef
        })}
        </MenuItem>
      </Menu>
      <Menu>
        <MenuItem ref={itemNotificationsRef} toggle="dropdown" trigger="click" dropdownProps={{
        placement: isRTL() ? 'bottom-start' : 'bottom-end',
        modifiers: [{
          name: 'offset',
          options: {
            offset: isRTL() ? [-70, 10] : [70, 10] // [skid, distance]
          }
        }]
      }}>
          <MenuToggle  className="btn btn-icon btn-icon-lg relative cursor-pointer size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500">
           <button onClick={()=>{setsettingModal(true)}}>
            <KeenIcon  icon="setting" />

           </button>
          </MenuToggle>
        </MenuItem>
     <AccountSettingsModal open={settingModal} onOpenChange={()=>{setsettingModal(false)}}  />

      </Menu>

      <Menu>
        <MenuItem ref={itemUserRef} toggle="dropdown" trigger="click" dropdownProps={{
        placement: isRTL() ? 'bottom-start' : 'bottom-end',
        modifiers: [{
          name: 'offset',
          options: {
            offset: isRTL() ? [-20, 10] : [20, 10] // [skid, distance]
          }
        }]
      }}>
          <MenuToggle className="btn btn-icon rounded-full">
            <img className="size-9 rounded-full border-2 border-success shrink-0" src={toAbsoluteUrl(`/media/avatars/${user.imageName}`)} alt="" />
          </MenuToggle>
          {DropdownUser({
          menuItemRef: itemUserRef
        })}
        </MenuItem>
      </Menu>
    </div>;
};
export { HeaderTopbar };