// Only company-product orders consume stock. Own-cups orders never
// touched product sizes[].stock, so there's nothing to restore.
if (newStatus === "Cancelled" && order.status !== "Cancelled" && !order.isProvided) {
  for (const item of (order.items || [])) {
    if (!item.productId || !item.size || !item.quantity) continue;

// Atomic restore — single write, no read-modify-write race.
const updated = await Product.findOneAndUpdate(
  { id: item.productId, "sizes.name": item.size },
  {
    $inc: { "sizes.$.stock": item.quantity },
    $set: { updatedAt: new Date() },
  },
  { new: true },
);

  }
}