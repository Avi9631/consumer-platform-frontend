/**
 * Example Component: Using Authentication
 * This file demonstrates how to use the authentication system in your components
 */

import { useAuth } from "@/context/AuthContext";
import { useApi } from "@/hooks/useApi";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Example 1: Protected Route Component
 * Redirects to login if user is not authenticated
 */
export function ProtectedPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div>Loading...</div>;
  
  if (!isAuthenticated) {
    router.push("/");
    return null;
  }

  return <div>Protected Content - User is logged in</div>;
}

/**
 * Example 2: Displaying User Information
 */
export function UserProfile() {
  const { user, logout } = useAuth();

  if (!user) return <div>Not logged in</div>;

  return (
    <Card className="p-6">
      <h2>User Profile</h2>
      <p>Name: {user.firstName} {user.lastName}</p>
      <p>Phone: {user.phone}</p>
      <p>Initial: {user.nameInitial}</p>
      {user.email && <p>Email: {user.email}</p>}
      <Button onClick={logout} variant="destructive">
        Logout
      </Button>
    </Card>
  );
}

/**
 * Example 3: Making Authenticated API Calls
 * Automatically handles token refresh on 401
 */
export function PropertyList() {
  const api = useApi();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/properties");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setProperties(data.data || data);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch properties:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Properties</h2>
      {properties.length === 0 ? (
        <p>No properties found</p>
      ) : (
        <ul>
          {properties.map((prop) => (
            <li key={prop.id}>{prop.name} - ${prop.price}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * Example 4: POST Request with useApi
 */
export function CreateProperty() {
  const api = useApi();
  const [loading, setLoading] = useState(false);

  const handleCreateProperty = async (formData) => {
    setLoading(true);
    try {
      const response = await api.post("/api/properties", {
        name: formData.name,
        price: formData.price,
        location: formData.location,
      });

      if (!response.ok) {
        throw new Error("Failed to create property");
      }

      const data = await response.json();
      console.log("Property created:", data);
      
      // Refresh property list or handle success
      return data;
    } catch (error) {
      console.error("Error creating property:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        await handleCreateProperty({
          name: e.target.name.value,
          price: e.target.price.value,
          location: e.target.location.value,
        });
      }}
    >
      <input name="name" placeholder="Property name" required />
      <input name="price" type="number" placeholder="Price" required />
      <input name="location" placeholder="Location" required />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Property"}
      </button>
    </form>
  );
}

/**
 * Example 5: Conditional Rendering Based on Auth Status
 */
export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header>
      <h1>App Header</h1>
      {isAuthenticated ? (
        <div>
          <span>Welcome, {user?.firstName}!</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <div>
          <span>Not logged in</span>
          <button onClick={() => setLoginOpen(true)}>Login</button>
        </div>
      )}
    </header>
  );
}

/**
 * Example 6: Token Refresh Manual Check
 * (Usually happens automatically with useApi)
 */
export function TokenStatus() {
  const { accessToken, refreshToken, refreshAccessToken, isRefreshing } = useAuth();

  const handleManualRefresh = async () => {
    const success = await refreshAccessToken();
    console.log("Token refresh result:", success);
  };

  return (
    <Card className="p-4">
      <h3>Token Status</h3>
      <p>Access Token: {accessToken ? "Present" : "Missing"}</p>
      <p>Refresh Token: {refreshToken ? "Present" : "Missing"}</p>
      <p>Refreshing: {isRefreshing ? "Yes" : "No"}</p>
      <Button onClick={handleManualRefresh} disabled={isRefreshing}>
        Refresh Token Manually
      </Button>
    </Card>
  );
}

/**
 * Example 7: Using Auth Headers Manually
 * (Usually useApi handles this automatically)
 */
export function CustomApiCall() {
  const { getAuthHeaders } = useAuth();

  const makeCustomRequest = async () => {
    const headers = getAuthHeaders();
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/custom`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include",
      body: JSON.stringify({ data: "example" }),
    });

    return response.json();
  };

  return (
    <Button onClick={makeCustomRequest}>
      Make Custom API Call
    </Button>
  );
}

/**
 * Example 8: Update User Data
 */
export function UpdateProfile() {
  const { user, updateUser } = useAuth();

  const handleUpdateUser = (newData) => {
    updateUser({
      firstName: newData.firstName,
      lastName: newData.lastName,
    });
  };

  return (
    <div>
      <p>Current name: {user?.firstName} {user?.lastName}</p>
      <button
        onClick={() =>
          handleUpdateUser({
            firstName: "John",
            lastName: "Doe",
          })
        }
      >
        Update Name
      </button>
    </div>
  );
}
