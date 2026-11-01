import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className="container mt-5">
      <div className="p-5 mb-4 bg-light rounded-3 shadow-sm">
        <div className="container-fluid py-5">
          <h1 className="display-5 fw-bold text-primary">KansControl</h1>
          <p className="col-md-8 fs-4">
            Система автоматизации отчётности и управления заявками для сети магазинов канцелярских товаров.
          </p>
          <button className="btn btn-dark btn-lg" type="button">
            Войти в систему
          </button>
        </div>
      </div>
    </main>
  );
}
