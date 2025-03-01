import { useEffect, useState } from "react";
import Axios from "../../Axios";
import { toast, ToastContainer } from "react-toastify";
import { Link, useParams } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { useSelector } from "react-redux";

export const SelectProduct = () => {
  const { data } = useSelector(state => state.user)
  const { productId } = useParams();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [admin, setAdmin] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await Axios.get("product");
        const fetchedProducts = response.data.data || [];
        setAdmin(data.firstName)
        setProducts(fetchedProducts);
        console.log("Fetched products:", fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error(
          "Mahsulotlarni olishda xato: " +
          (error.response?.data?.message || "Unknown error")
        );
      }
    };
    fetchProducts();
  }, []);

  const handleQuantityChange = (productId, operation) => {
    setCart((prev) => {
      const newCart = { ...prev };
      const currentQuantity = newCart[productId] || 0;
      const newQuantity =
        operation === "add" ? currentQuantity + 1 : currentQuantity - 1;

      if (newQuantity > 0) {
        newCart[productId] = newQuantity;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  useEffect(() => {
    const calculateTotal = () => {
      let price = 0;
      let quantity = 0;

      for (const productId in cart) {
        const product = products.find((p) => String(p.id) === productId);
        if (product) {
          price += product.price * cart[productId];
          quantity += cart[productId];
        } else {
          console.warn(
            `Product with ID ${productId} not found in products array.`
          );
        }
      }

      setTotalPrice(isNaN(price) ? 0 : price);
      setTotalQuantity(isNaN(quantity) ? 0 : quantity);

      console.log(
        "Calculated total price:",
        price,
        "Total quantity:",
        quantity
      );
    };

    calculateTotal();
  }, [cart, products]);

  const handlePurchase = async () => {
    if (totalQuantity === 0) {
      toast.error("Sotib olish uchun hech bo'lmasa bitta mahsulot tanlang.");
      return;
    }

    for (const productId in cart) {
      const product = products.find((p) => String(p.id) === productId);
      if (product && cart[productId] > product.stock) {
        toast.error(
          `${product.title} uchun kerakli miqdor mavjud emas. Omborda faqat ${product.stock} dona mavjud.`
        );
        return;
      }
    }

    setLoading(true);

    const selectedProducts = Object.keys(cart).map((productId) => ({
      productId: productId,
      quantity: cart[productId],
      admin: admin
    }));

    toast.promise(
      Axios.post(`partner/${productId}/add-products`, {
        products: selectedProducts,
      })
        .then((response) => {
          setCart({});
          setTotalPrice(0);
          setTotalQuantity(0);
          setTimeout(() => {
            window.location.href = "/partners";
          }, 1000);
        })
        .catch((error) => {
          if (error.response?.status === 400) {
            toast.error(
              "Mahsulotni sotib olishda xato. Iltimos, miqdorni tekshiring."
            );
          } else {
            toast.error(
              "Sotib olishda xato: " +
              (error.response?.data?.message || "Noma'lum xato")
            );
          }
        })
        .finally(() => {
          setLoading(false);
        }),
      {
        pending: "Sotib olish amalga oshirilmoqda...",
        success: "Sotib olish muvaffaqiyatli amalga oshirildi!",
        error: "Sotib olishda xato yuz berdi.",
      }
    );
  };


  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  return (
    <div className="p-4 bg-green-100 h-[100vh]">
      <ToastContainer />
      <h1 className="text-2xl font-semibold mb-4">Mahsulotlarni Tanlash</h1>
      <div className="relative">
        <IoSearch className="absolute top-3 right-3 text-gray-500" />
        <input
          type="text"
          placeholder="Mahsulotni qidirish..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        />
      </div>

      <div className="grid grid-cols-1 h-[65vh] overflow-auto sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-md shadow-sm p-2 flex flex-col"
          >
         <div className="flex items-center gap-2">
          <div>
          <h2 className="text-md font-semibold">{product.title}</h2>
            <p className="text-gray-600">Narxi:
              {" "}  {new Intl.NumberFormat('us').format(product.price)}
              {" "}
              so'm</p>
            <p className="text-gray-600">Mavjud: {product.stock} dona</p>
            <p className="text-gray-600">O'lcham: {product.size}</p>
            <div className="flex items-center mt-2">
              <button
                onClick={() => handleQuantityChange(product.id, "subtract")}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                -
              </button>
              <input
                type="number"
                value={cart[product.id] || 0}
                onChange={(e) => {
                  const newQuantity = Math.max(
                    0,
                    parseInt(e.target.value) || 0
                  );
                  setCart((prev) => ({ ...prev, [product.id]: newQuantity }));
                }}
                className="mx-2 w-16 text-center border rounded"
                min="0"
                max={product.stock}
              />
              <button
                onClick={() => handleQuantityChange(product.id, "add")}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                +
              </button>
            </div>
          </div>
         </div>

            {cart[product.id] > product.stock && (
              <p className="text-red-500 text-sm mt-2">
                Tanlangan miqdor mavjud miqdordan ko'p!
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">
          Umumiy narx: {totalPrice || 0} so'm ({totalQuantity || 0} ta mahsulot)
        </h2>
        <div className="flex gap-2 items-center mt-2">
          <button
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            <Link to={"/partners"}>
              Ortga qaytish
            </Link>
          </button>
          <button
            onClick={handlePurchase}
            className="bg-sidebarBg text-white py-2 px-4 rounded"
            disabled={loading} 
          >
            {loading ? "Iltimos, kuting..." : "Sotib olish"}
          </button>
        </div>
      </div>
    </div >
  );
};
