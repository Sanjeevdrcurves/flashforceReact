const SecurityLogData = [
  {
    timestamp: 'System',
    eventType: {
      icon: {
        name: 'information-4',
        variant: 'text-danger',
      },
      label: 'Unauthorized Access',
    },
    actionTaken: '17 Jun, 2024',
    sourceIp: 'System Administrator',
    destinationIp: '30 Apr, 2024',
    severity: {
      label: '120 MB',
      variant: 'badge-primary',
    },
  },
  {
    timestamp: 'System',
    eventType: {
      icon: {
        name: 'key',
        variant: 'text-warning',
      },
      label: 'Key Rotation',
    },
    actionTaken: 'Key Successfully Rotated',
    sourceIp: '10.0.0.1',
    destinationIp: '192.168.1.1',
    severity: {
      label: 'Medium',
      variant: 'badge-primary',
    },
  },
];

export { SecurityLogData };
