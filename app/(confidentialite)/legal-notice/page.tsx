import { NextPage } from "next";

const LegalNotice: NextPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Mentions légales</h1>

      <div className="space-y-4 text-gray-700">
        <p>
          <strong>Éditeur :</strong> Société XYZ, immatriculée au RCS de Paris
          sous le numéro 123 456 789.
        </p>
        <p>
          <strong>Siège social :</strong> 123 Rue de l&apos;Exemple, 75000 Paris
        </p>
        <p>
          <strong>Directeur de publication :</strong> John Doe
        </p>
        <p>
          <strong>Hébergeur :</strong> Vercel Inc., San Francisco.
        </p>
        <p>
          <strong>Contact :</strong>{" "}
          <a
            href="mailto:legal@example.com"
            className="text-blue-600 hover:underline"
          >
            legal@example.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default LegalNotice;
