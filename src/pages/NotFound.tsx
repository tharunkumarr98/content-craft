import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/Layout";

const NotFound = () => {
  return (
    <Layout>
      <Helmet>
        <title>404 - Page Not Found - DataBytes</title>
      </Helmet>
      
      <div className="container py-20 text-center">
        <h1 className="text-6xl font-bold text-foreground mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">
          This page doesn't exist.
        </p>
        <Link 
          to="/" 
          className="text-primary hover:underline underline-offset-2"
        >
          ← Back to home
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
