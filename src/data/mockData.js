// Mock data for development/fallback
// This matches your backend driver model structure

export const riderData = {
  driverId: 'DRV0001',
  firstName: 'Juan',
  lastName: 'Dela Cruz',
  username: 'juan.delacruz',
  email: 'juan@acapshop.com',
  phoneNumber: '+63 912 3456 789',
  plateNumber: 'ABC-1234',
  vehicleDescription: 'Honda Wave 125',
  fullName: 'Juan Dela Cruz',
  displayName: 'Juan Dela Cruz',
  available: true,
  assignedOrdersCount: 5,
  stats: {
    assigned: 5,
    completed: 12,
    pending: 3,
    todayEarnings: 850
  }
}

export const mockOrders = [
  {
    id: 101,
    _id: '507f1f77bcf86cd799439011',
    customerName: 'Maria Santos',
    customerPhone: '+63 917 1234 567',
    address: '123 Mabini St., Brgy. San Isidro, Pasig City',
    items: ['Paper Cups 12oz (50pcs)', 'Lids 12oz (50pcs)'],
    total: 1250,
    status: 'assigned',
    createdAt: new Date().toISOString(),
    deliveryFee: 120,
    notes: 'Call upon arrival',
    proofOfDelivery: null,
    driverId: 'DRV0001'
  },
  {
    id: 102,
    _id: '507f1f77bcf86cd799439012',
    customerName: 'Roberto Gomez',
    customerPhone: '+63 918 7654 321',
    address: '456 Rizal Ave., Brgy. San Lorenzo, Makati City',
    items: ['Food Box 8x8 (20pcs)', 'Cutlery Set (100pcs)'],
    total: 980,
    status: 'assigned',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    deliveryFee: 90,
    notes: 'Gate code: 4321',
    proofOfDelivery: null,
    driverId: 'DRV0001'
  },
  {
    id: 103,
    _id: '507f1f77bcf86cd799439013',
    customerName: 'Ana Reyes',
    customerPhone: '+63 919 8765 432',
    address: '789 P. Burgos St., Brgy. Poblacion, Mandaluyong',
    items: ['Paper Cups 8oz (100pcs)', 'Lids 8oz (100pcs)'],
    total: 2100,
    status: 'out-for-delivery',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    deliveryFee: 150,
    notes: 'Leave at front desk',
    proofOfDelivery: null,
    driverId: 'DRV0001'
  }
]

export const getStatusLabel = (status) => {
  const labels = {
    'assigned': 'Assigned',
    'out-for-delivery': 'Out for Delivery',
    'completed': 'Completed',
    'cancelled': 'Cancelled'
  }
  return labels[status] || status
}

export const getStatusColor = (status) => {
  const colors = {
    'assigned': 'blue',
    'out-for-delivery': 'orange',
    'completed': 'green',
    'cancelled': 'red'
  }
  return colors[status] || 'gray'
}

export const getStatusActions = (status) => {
  const actions = {
    'assigned': ['out-for-delivery'],
    'out-for-delivery': ['completed'],
    'completed': [],
    'cancelled': []
  }
  return actions[status] || []
}