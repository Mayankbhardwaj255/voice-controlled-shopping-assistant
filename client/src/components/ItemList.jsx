const ItemList = ({ items }) => {
  return (
    <div className="p-6 bg-white shadow-md rounded-2xl">
      <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        📝 Shopping List
      </h3>

      {items.length === 0 ? (
        <p className="text-gray-500 italic">No items yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-gray-700">Item</th>
                <th className="px-4 py-2 text-left text-gray-700">Category</th>
                <th className="px-4 py-2 text-left text-gray-700">Brand</th>
                <th className="px-4 py-2 text-left text-gray-700">Size</th>
                <th className="px-4 py-2 text-left text-gray-700">Quantity</th>
                <th className="px-4 py-2 text-left text-gray-700">Price</th>
              </tr>
            </thead>
            <tbody>
              {items.map(({ item, category, brand, size, quantity, price }, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-2">{item}</td>
                  <td className="px-4 py-2">{category || 'Uncategorized'}</td>
                  <td className="px-4 py-2">{brand || 'any'}</td>
                  <td className="px-4 py-2">{size || 'any'}</td>
                  <td className="px-4 py-2">{quantity}</td>
                  <td className="px-4 py-2">
                    {price !== '—' ? `${price} $` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ItemList;
