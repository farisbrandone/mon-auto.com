import { NextPage } from "next";
import Link from "next/link";

const PrivacyPolicy: NextPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Politique de confidentialité</h1>
      <p className="mb-6">
        <strong>
          Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}
        </strong>
      </p>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">1. Données collectées</h2>
        <p className="text-gray-700">
          Nous collectons uniquement les données nécessaires au fonctionnement
          de l'application (ex: email pour l'authentification).
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">
          2. Utilisation des données
        </h2>
        <p className="text-gray-700">
          Les données ne sont jamais vendues à des tiers. Elles servent
          uniquement à fournir le service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-3">3. Cookies</h2>
        <p className="text-gray-700">
          Nous utilisons des cookies essentiels. Vous pouvez les désactiver dans
          les paramètres de votre navigateur.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-3">4. Vos droits (RGPD)</h2>
        <p className="text-gray-700">
          Vous pouvez demander l'accès, la modification ou la suppression de vos
          données via{" "}
          <Link href="/contact" className="text-blue-600 hover:underline">
            notre formulaire de contact
          </Link>
          .
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
