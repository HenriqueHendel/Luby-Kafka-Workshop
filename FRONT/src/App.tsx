import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import useAxios from "axios-hooks";
import { io, Socket } from "socket.io-client";

interface IProduct {
  id: number;
  name: string;
  price: string;
  quantity: number;
  purchaseId: number;
  percentage?: number;
}

const App: React.FC = () => {
  const socketRef = useRef<Socket>();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [boughtProducts, setBoughtProduct] = useState<IProduct[]>([]);

  const percentToNextLevel = 10;

  const experienceToNextLevel = 100;

  const currentPercentage = 10;

  const [{ loading }, getProducts] = useAxios(
    {
      method: "GET",
      url: "http://localhost:3333/products",
    },
    { manual: true }
  );

  const [{}, newPurchase] = useAxios(
    {
      method: "POST",
      url: "http://localhost:3001/purchase",
    },
    { manual: true }
  );

  useEffect(() => {
    socketRef.current = io("http://localhost:3001", {
      transports: ["websocket"],
    });

    socketRef.current.on("new-percentage", (response) => {
      const data = JSON.parse(response);

      const referenced = document.getElementById(`${data.purchaseId}`);

      if (referenced) {
        referenced.innerHTML = data.percentage;
      }
    });

    (async () => {
      const { data } = await getProducts();
      setProducts(data);
    })();
  }, [getProducts]);

  const purchaseProduct = async (id: number, purchaseId: number) => {
    const product = { id, quantity: 1, purchaseId };

    const { data } = await newPurchase({
      data: product,
    });
  };

  const handleBought = (product: IProduct) => {
    purchaseProduct(product.id, product.purchaseId);
    setBoughtProduct([...boughtProducts, product]);
  };

  return (
    <>
      <div className="Header">
        <h1>LubyShop</h1>
        <hr />
      </div>
      <div className="App">
        {products.map((product, index) => (
          <div
            className="Card select"
            key={product.id}
            onClick={() =>
              handleBought({
                ...product,
                purchaseId: Math.round(Math.random() * 10000),
              })
            }
          >
            <div className="image">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Qpy5JQasM5DGbHEapwnwER7z0K6mihxm4Q&usqp=CAU" />
            </div>
            <div className="text">
              <p>{product.name}</p>
            </div>
          </div>
        ))}
      </div>

      {boughtProducts.length > 0 ? (
        <>
          <div className="Header">
            <h1>Minhas Compras</h1>
            <hr />
          </div>

          <div className="App">
            {boughtProducts.map((product) => (
              <div className="Card" key={product.id}>
                <div className="image">
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2Qpy5JQasM5DGbHEapwnwER7z0K6mihxm4Q&usqp=CAU" />
                </div>
                <div className="text">
                  <div>
                    <p>{product.name}</p>
                    <p>Id da compra: {product.purchaseId}</p>
                    {/* <p id={String(product.purchaseId)}></p> */}
                    <header className="experienceBar">
                      <span>0 %</span>
                      <div>
                        <div style={{ width: `100%` }} />
                        <span
                          className="currentExperience"
                          style={{ left: `${product.purchaseId}%` }}
                          id={String(product.purchaseId)}
                        >
                          {currentPercentage} xp
                        </span>
                      </div>
                      <span>{experienceToNextLevel} %</span>
                    </header>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : null}
    </>
  );
};

export default App;
