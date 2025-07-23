import React from 'react';
import Checkbox from '../common/checkBox';
import { Icon } from '@iconify/react';

export default function PermissionsSection({ locale, permissions, onPermissionChange }) {
  // Default permissions structure if not defined in config
  const isRTL = locale.getLanguage() === 'ar';
  const defaultPermissions = {
    admin: {
      add: true,
      claim: true,
      close: true,
      copy: true,
      delete: true,
      reminder: true,
    },
    user: {
      add: true,
      close: true,
      copy: true,
      reminder: false,
    },
  };

  // Use provided permissions or defaults
  const currentPermissions = permissions || defaultPermissions;

  // Permission details with icons and descriptions
  const permissionDetails = {
    add: {
      icon: 'mdi:account-multiple-plus',
      iconClass: 'text-blue-500',
    },
    claim: {
      icon: 'mdi:shield-lock',
      iconClass: 'text-amber-500',
    },
    close: {
      icon: 'mdi:email-off',
      iconClass: 'text-red-500',
    },
    copy: {
      icon: 'mdi:content-copy',
      iconClass: 'text-indigo-500',
    },
    delete: {
      icon: 'mdi:delete',
      iconClass: 'text-rose-500',
    },
    reminder: {
      icon: 'mdi:alarm',
      iconClass: 'text-emerald-500',
    },
  };

  // Helper function to get localized title for a permission
  const getPermissionTitle = (key) => {
    return locale?.tickets?.permissions?.permissions?.[key]?.title || permissionDetails[key]?.title || key;
  };

  // Helper function to get localized description for a permission
  const getPermissionDescription = (key) => {
    return locale?.tickets?.permissions?.permissions?.[key]?.description || permissionDetails[key]?.description || '';
  };

  return (
    <div className="flex flex-col">
      <h2 className="text-[18px] font-bold mb-4">{locale?.tickets?.permissions?.title || 'Permissions'}</h2>
      <p className="text-sm text-gray-400 mb-6">
        {locale?.tickets?.permissions?.description || 'Configure who can perform actions on tickets'}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
        {/* Admin Permissions */}
        <div className="bg-[#0d1226] p-6 rounded-lg border border-[#282b38]">
          <h3 className="text-[24px] font-semibold mb-4">{locale?.tickets?.permissions?.adminTitle || 'Admin Permissions'}</h3>

          <div className="space-y-4">
            {Object.keys(currentPermissions.admin).map((key) => (
              <div key={`admin-${key}`} className="flex justify-between items-center p-2 hover:bg-[#131836] rounded-md transition-colors">
                <div className="">
                  <div className="flex items-center">
                    <div className={`bg-emerald-500/10 p-2 rounded-lg ${isRTL ? 'ml-2' : 'mr-2'}`}>
                      <Icon icon={permissionDetails[key].icon} className={`w-5 h-5 ${permissionDetails[key].iconClass}`} />
                    </div>

                    <label htmlFor={`admin-${key}`} className="text-lg font-medium cursor-pointer">
                      {getPermissionTitle(key)}
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{getPermissionDescription(key)}</p>
                </div>
                <Checkbox
                  isChecked={currentPermissions.admin[key]}
                  toggleCheckbox={() => onPermissionChange('admin', key, !currentPermissions.admin[key])}
                  id={`admin-${key}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* User Permissions */}
        <div className="bg-[#0d1226] p-6 rounded-lg border border-[#282b38]">
          <h3 className="text-[24px] font-semibold mb-4">{locale?.tickets?.permissions?.userTitle || 'User Permissions'}</h3>

          <div className="space-y-4">
            {Object.keys(currentPermissions.user).map((key) => (
              <div key={`user-${key}`} className="flex justify-between items-center p-2 hover:bg-[#131836] rounded-md transition-colors">
                <div className="">
                  <div className="flex items-center">
                    <div className={`bg-emerald-500/10 p-2 rounded-lg ${isRTL ? 'ml-2' : 'mr-2'}`}>
                      <Icon icon={permissionDetails[key].icon} className={`w-5 h-5 ${permissionDetails[key].iconClass}`} />
                    </div>

                    <label htmlFor={`user-${key}`} className="text-lg font-medium cursor-pointer">
                      {getPermissionTitle(key)}
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{getPermissionDescription(key)}</p>
                </div>
                <Checkbox
                  isChecked={currentPermissions.user[key]}
                  toggleCheckbox={() => onPermissionChange('user', key, !currentPermissions.user[key])}
                  id={`user-${key}`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#0d1226] p-4 rounded-lg border border-[#282b38] mb-4">
        <div className="flex items-start">
          <div className={`mt-1 ${isRTL ? 'ml-3' : 'mr-3'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-1">{locale?.tickets?.permissions?.infoTitle || 'Permission Information'}</h4>
            <p className="text-xs text-gray-400">
              {locale?.tickets?.permissions?.infoDescription ||
                'Admin permissions apply to server moderators and administrators. User permissions apply to ticket creators and members.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
