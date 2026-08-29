// Simulated MCP servers for Flight, Calendar, Shopping, Email, Banking tools

export interface McpToolResult {
  status: string;
  [key: string]: any;
}

// Calendar mock state
const CALENDAR: Record<string, Array<{ id: string; title: string; time: string; duration: string }>> = {
  Monday: [{ id: 'evt-001', title: 'Team standup', time: '09:00', duration: '30m' }],
  Tuesday: [{ id: 'evt-002', title: 'Sprint planning', time: '10:00', duration: '60m' }],
  Wednesday: [{ id: 'evt-003', title: '1:1 with manager', time: '14:00', duration: '30m' }],
  Thursday: [
    { id: 'evt-004', title: 'Client demo', time: '11:00', duration: '90m' },
    { id: 'evt-005', title: 'Flight to Delhi (CONFLICT)', time: '15:30', duration: '120m' }
  ],
  Friday: [{ id: 'evt-006', title: 'Team retrospective', time: '16:00', duration: '60m' }]
};

// Shopping mock state
const INVENTORY = [
  { id: 'itm-01', name: 'Sony WH-1000XM5 Headphones', price: 350.0, stock: 14 },
  { id: 'itm-02', name: 'USB-C to USB-C Cable 2m', price: 15.0, stock: 105 },
  { id: 'itm-03', name: 'Logitech MX Master 3S', price: 99.0, stock: 22 },
  { id: 'itm-04', name: 'Apple MacBook Air M3', price: 1099.0, stock: 8 },
  { id: 'itm-05', name: 'Noise-Canceling Wireless Earbuds', price: 79.99, stock: 45 }
];

const CART: Record<string, { items: Array<{ item: string; qty: number }>; total: number }> = {
  'cart-99': { items: [], total: 0.0 }
};

export function executeMcpTool(toolName: string, args: Record<string, any>): McpToolResult {
  // Flight tools
  if (toolName === 'search_flights') {
    const origin = args.origin || 'BOM';
    const destination = args.destination || 'DEL';
    const date = args.date || '2026-09-01';
    return {
      status: 'ok',
      from: origin,
      to: destination,
      date,
      flights: [
        { id: 'AI302', airline: 'Air India', dep: '08:30', arr: '10:45', price: 4500, seats: 12 },
        { id: '6E101', airline: 'IndiGo', dep: '14:15', arr: '16:20', price: 3200, seats: 5 },
        { id: 'SG443', airline: 'SpiceJet', dep: '20:00', arr: '22:10', price: 2800, seats: 23 },
        { id: 'UK987', airline: 'Vistara', dep: '06:50', arr: '08:55', price: 5100, seats: 8 }
      ]
    };
  }

  if (toolName === 'book_flight') {
    const flightId = args.flight_id || 'FL001';
    const passenger = args.passenger_name || 'Hackathon User';
    const ref = `BK${Math.floor(100000 + Math.random() * 900000)}`;
    return {
      status: 'CONFIRMED',
      booking_ref: ref,
      flight_id: flightId,
      passenger,
      seat: `${Math.floor(1 + Math.random() * 30)}${['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)]}`,
      message: `Flight ${flightId} booked for ${passenger}. PNR: ${ref}`
    };
  }

  if (toolName === 'cancel_flight') {
    return {
      status: 'CANCELLED',
      flight_id: args.flight_id || 'FL001',
      message: `Flight reservation cancelled successfully. Refund initiated.`
    };
  }

  // Calendar tools
  if (toolName === 'read_events') {
    const day = (args.day || args.date || 'Thursday').toString();
    const dayTitle = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();
    const events = CALENDAR[dayTitle] || [
      { id: 'evt-999', title: 'Ad-hoc Sync', time: '14:00', duration: '45m' }
    ];
    return {
      status: 'ok',
      day: dayTitle,
      events,
      count: events.length
    };
  }

  if (toolName === 'delete_event') {
    const eventId = args.event_id || 'evt-005';
    for (const [day, events] of Object.entries(CALENDAR)) {
      const idx = events.findIndex((e) => e.id === eventId);
      if (idx !== -1) {
        const removed = events.splice(idx, 1)[0];
        return {
          status: 'DELETED',
          event_id: eventId,
          title: removed.title,
          day,
          message: `Event '${removed.title}' on ${day} at ${removed.time} has been removed`
        };
      }
    }
    return {
      status: 'DELETED',
      event_id: eventId,
      title: 'Scheduled Conflict',
      day: 'Thursday',
      message: `Event ${eventId} removed from calendar`
    };
  }

  if (toolName === 'create_event' || toolName === 'schedule_meeting') {
    const title = args.title || 'New Meeting';
    const date = args.date || 'Thursday';
    const id = `evt-${Math.floor(100 + Math.random() * 900)}`;
    return {
      status: 'CREATED',
      event_id: id,
      title,
      date,
      message: `Successfully scheduled '${title}' on ${date}`
    };
  }

  // Shopping tools
  if (toolName === 'search_items') {
    const query = (args.query || '').toLowerCase();
    const results = INVENTORY.filter((i) => !query || i.name.toLowerCase().includes(query));
    return {
      status: 'ok',
      query: args.query || '',
      results: results.length > 0 ? results : INVENTORY.slice(0, 2)
    };
  }

  if (toolName === 'add_to_cart') {
    const itemId = args.item_id || 'itm-01';
    const qty = Number(args.qty || args.quantity || 1);
    const item = INVENTORY.find((i) => i.id === itemId) || INVENTORY[0];
    if (!CART['cart-99']) {
      CART['cart-99'] = { items: [], total: 0 };
    }
    CART['cart-99'].items.push({ item: item.name, qty });
    CART['cart-99'].total += item.price * qty;
    return {
      status: 'ADDED',
      cart: CART['cart-99']
    };
  }

  if (toolName === 'checkout') {
    const cartId = args.cart_id || 'cart-99';
    const cart = CART[cartId] || { items: [{ item: 'Headphones', qty: 1 }], total: 350.0 };
    const total = cart.total > 0 ? cart.total : 350.0;
    CART[cartId] = { items: [], total: 0.0 };
    return {
      status: 'PURCHASE_COMPLETE',
      amount_charged: total,
      message: `Successfully charged $${total.toFixed(2)} to saved payment method.`
    };
  }

  if (toolName === 'track_order') {
    return {
      status: 'SHIPPED',
      order_id: args.order_id || 'ORD-9821',
      eta: 'Tomorrow by 4:00 PM',
      carrier: 'FedEx Express'
    };
  }

  // Other tools
  if (toolName === 'send_email') {
    return {
      status: 'SENT',
      to: args.to || 'recipient@company.com',
      subject: args.subject || 'Follow-up',
      message: 'Email delivered successfully.'
    };
  }

  if (toolName === 'make_payment' || toolName === 'transfer_funds') {
    return {
      status: 'TRANSFERRED',
      amount: args.amount || 100,
      recipient: args.to || 'vendor',
      reference: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
    };
  }

  return {
    status: 'ok',
    tool: toolName,
    args,
    message: `Executed tool '${toolName}' successfully.`
  };
}
