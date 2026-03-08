import api from './api';

export const downloadInvoicePDF = async (orderId, onProgress = null) => {
  try {
    if (onProgress) onProgress(true);
    
    const response = await api.get(`/orders/${orderId}/invoice`, {
      responseType: 'blob',
      timeout: 30000 // 30 second timeout
    });
    
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SHOERACK-Invoice-${orderId.slice(-8).toUpperCase()}.pdf`;
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('PDF download error:', error);
    
    let errorMessage = 'Failed to download invoice PDF';
    if (error.response?.status === 404) {
      errorMessage = 'Invoice not found';
    } else if (error.response?.status === 401) {
      errorMessage = 'Not authorized to download this invoice';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout - please try again';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    return { success: false, error: errorMessage };
  } finally {
    if (onProgress) onProgress(false);
  }
};

export const generateInvoicePreview = (order) => {
  if (!order) return null;
  
  return {
    invoiceNumber: order._id.slice(-8).toUpperCase(),
    date: new Date(order.createdAt).toLocaleDateString('en-GB'),
    time: new Date(order.createdAt).toLocaleTimeString('en-GB', { hour12: false }),
    status: order.status,
    customer: {
      name: order.user?.name || 'Admin-User',
      email: order.user?.email || 'admin@shoerack.com'
    },
    shipping: {
      name: order.shippingAddress?.street || order.user?.name || 'Admin-User',
      address: `${order.shippingAddress?.city || 'Surat'}, ${order.shippingAddress?.state || 'Gujarat'}`,
      postal: `${order.shippingAddress?.zipCode || '395009'}, ${order.shippingAddress?.country || 'India'}`
    },
    items: order.orderItems.map(item => ({
      name: item.name,
      size: item.size || '7',
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity
    })),
    totals: {
      subtotal: order.itemsPrice,
      shipping: order.shippingPrice,
      tax: order.taxPrice,
      total: order.totalPrice
    },
    payment: {
      method: order.paymentMethod === 'razorpay' ? 'Online Payment' : 'Cash on Delivery',
      status: order.isPaid ? 'PAID' : 'PENDING',
      paidAt: order.paidAt ? new Date(order.paidAt).toLocaleDateString('en-GB') : null
    }
  };
};