import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Link } from 'react-router-dom'
import FooterPage from '@/components/pagecomponent/footer-page';
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { useNavigate } from "react-router-dom"

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showpassword2, setShowpassword2] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (password1 !== password2) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://34.128.95.7:8000/akun/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password1, password2 }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Signup successful!');
        // Reset form fields
        setUsername('');
        setEmail('');
        setPassword1('');
        setPassword2('');
        navigate("/akun/signin")
        
      } else {
        setError(`Signup failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Create an Account</CardTitle>
            <CardDescription>Sign up to get started with our service</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="Enter your username"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password1">Password</Label>
                <div className="relative">
                  <Input
                    id="password1"
                    type={showPassword ? "text" : "password"}
                    value={password1}
                    onChange={(e) => setPassword1(e.target.value)}
                    required
                    placeholder="Enter your password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password2">Confirm Password</Label>
                <div className="relative">
                <Input
                  id="password2"
                  type={showpassword2 ? "text" : "password"}
                  value={password2}
                  onChange={(e) => setPassword2(e.target.value)}
                  required
                  placeholder="Confirm your password"
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowpassword2(!showpassword2)}
                  >
                    {showpassword2 ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link to="/akun/signin" className="text-primary hover:underline">
                Sign In
              </Link>
            </p>
          </CardFooter>
        </Card>
      </main>
      <FooterPage />
    </div>
  );
}