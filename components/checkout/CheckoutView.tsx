// components/checkout/CheckoutView.tsx (UPDATED)
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCartTotals } from "@/hooks/use-cart-totals";
import { useUserProfile } from "@/hooks/use-user-mutations";
import { CartItem } from "@/types/cart";
import { ShippingAddress } from "@/types/order";
import { Address } from "@/types/user";
import { InfoIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CheckoutSteps } from "./CheckoutSteps";
import { OrderReview } from "./OrderReview";
import { OrderSummaryCard } from "./OrderSummaryCard";
import { PaymentForm } from "./PaymentForm";
import { SavedAddresses } from "./SavedAddresses";
import { ShippingForm } from "./ShippingForm";

interface CheckoutViewProps {
  cart: CartItem[];
  cartTotal: number;
}

export function CheckoutView({ cart, cartTotal }: CheckoutViewProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingAddress, setShippingAddress] =
    useState<ShippingAddress | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [discountCode, setDiscountCode] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [useNewAddress, setUseNewAddress] = useState(false);

  const { data: profileData, isLoading: profileLoading } = useUserProfile();
  const user = profileData?.data;

  // Use unified totals hook with auto-calculation AND discount error
  const { totals, isCalculating, calculate, hasValidAddress, discountError } =
    useCartTotals({
      shippingAddressId: selectedAddressId,
      discountCode: discountCode,
      autoCalculate: true,
      onDiscountError: () => {
        // Clear discount code when there's an error
        setDiscountCode("");
      },
    });

  // Auto-select default address on mount
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0 && !selectedAddressId) {
      const defaultAddr = user.addresses.find((addr) => addr.isDefault);
      const addressToUse = defaultAddr || user.addresses[0];

      if (addressToUse._id) {
        setSelectedAddressId(addressToUse._id);
        setShippingAddress({
          address: addressToUse.address,
          city: addressToUse.city,
          postalCode: addressToUse.postalCode,
          country: addressToUse.country,
          phoneNumber: addressToUse.phoneNumber, // Include phone number
        });
      }
    }
  }, [user?.addresses, selectedAddressId]);

  const handleSelectSavedAddress = (address: Address) => {
    if (address._id) {
      setSelectedAddressId(address._id);
      setShippingAddress({
        address: address.address,
        city: address.city,
        postalCode: address.postalCode,
        country: address.country,
        phoneNumber: address.phoneNumber, // Include phone number
      });
      setUseNewAddress(false);
    }
  };

  const handleUseNewAddress = () => {
    setUseNewAddress(true);
    setSelectedAddressId("");
    setShippingAddress(null);
  };

  const handleShippingSubmit = (address: ShippingAddress) => {
    setShippingAddress(address);

    // Try to find matching saved address
    const savedAddress = user?.addresses?.find(
      (addr) =>
        addr.address === address.address &&
        addr.city === address.city &&
        addr.postalCode === address.postalCode
    );

    if (savedAddress?._id) {
      setSelectedAddressId(savedAddress._id);
    }

    // Ensure totals are calculated before moving forward
    if (!totals) {
      toast.info("Calculating shipping and tax...");
      calculate();
    }

    setCurrentStep(2);
  };

  const handlePaymentSubmit = (method: string) => {
    setPaymentMethod(method);

    // Double-check totals are ready
    if (!totals && shippingAddress) {
      toast.info("Finalizing order totals...");
      calculate();
    }

    setCurrentStep(3);
  };

  const handleBackToShipping = () => {
    setCurrentStep(1);
  };

  const handleBackToPayment = () => {
    setCurrentStep(2);
  };

  const handleDiscountChange = (code: string) => {
    setDiscountCode(code);
    if (code && shippingAddress) {
      toast.info("Applying discount code...");
    }
  };

  // Show loading state while profile is loading
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-slate-900 mx-auto mb-4" />
              <p className="text-slate-600">Loading checkout...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasSavedAddresses = user?.addresses && user.addresses.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Checkout
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Complete your purchase securely
            {user && ` • Welcome back, ${user.name.split(" ")[0]}!`}
          </p>
        </div>

        {/* Info Alert for First-Time Checkouts */}
        {currentStep === 1 && !hasSavedAddresses && (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <InfoIcon className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-900">
              Save your shipping address for faster checkout next time!
            </AlertDescription>
          </Alert>
        )}

        <CheckoutSteps currentStep={currentStep} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                {/* Saved Addresses Section */}
                {hasSavedAddresses && !useNewAddress && (
                  <SavedAddresses
                    addresses={user.addresses}
                    selectedAddressId={selectedAddressId}
                    onSelectAddress={handleSelectSavedAddress}
                    onUseNewAddress={handleUseNewAddress}
                  />
                )}

                {/* New Address Form */}
                {(useNewAddress || !hasSavedAddresses) && (
                  <ShippingForm
                    onSubmit={handleShippingSubmit}
                    initialData={shippingAddress}
                    showBackToSaved={useNewAddress && hasSavedAddresses}
                    onBackToSaved={() => setUseNewAddress(false)}
                  />
                )}

                {/* Quick Continue with Selected Address */}
                {hasSavedAddresses && !useNewAddress && selectedAddressId && (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        if (shippingAddress) {
                          handleShippingSubmit(shippingAddress);
                        }
                      }}
                      className="px-6 py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                    >
                      Continue to Payment →
                    </button>
                  </div>
                )}
              </div>
            )}

            {currentStep === 2 && shippingAddress && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <PaymentForm
                  onSubmit={handlePaymentSubmit}
                  onBack={handleBackToShipping}
                  initialMethod={paymentMethod}
                />
              </div>
            )}

            {currentStep === 3 && shippingAddress && paymentMethod && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <OrderReview
                  cart={cart}
                  shippingAddress={shippingAddress}
                  paymentMethod={paymentMethod}
                  onBack={handleBackToPayment}
                  totals={totals}
                  discountCode={discountCode}
                />
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummaryCard
              cart={cart}
              cartTotal={cartTotal}
              shippingAddress={shippingAddress}
              totals={totals}
              isCalculating={isCalculating}
              onDiscountChange={handleDiscountChange}
              currentStep={currentStep}
              discountError={discountError} // Pass discount error
            />
          </div>
        </div>
      </div>
    </div>
  );
}
