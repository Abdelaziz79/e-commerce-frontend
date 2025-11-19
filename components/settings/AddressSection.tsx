"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useAddAddress,
  useDeleteAddress,
  useUpdateAddress,
  useUserProfile,
} from "@/hooks/use-user-mutations";
import { AddAddressData, Address } from "@/types/user";
import { Home, Loader2, MapPin, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// Address Section Component (No changes needed)
function AddressSection() {
  const { data: profileData } = useUserProfile();
  const addAddress = useAddAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [newAddress, setNewAddress] = useState<AddAddressData>({
    address: "",
    city: "",
    postalCode: "",
    country: "",
    isDefault: false,
  });

  const addresses = profileData?.data?.addresses || [];

  const handleAddAddress = () => {
    if (
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.postalCode ||
      !newAddress.country
    ) {
      toast.error("Please fill in all address fields");
      return;
    }

    addAddress.mutate(newAddress, {
      onSuccess: () => {
        setIsAddingNew(false);
        setNewAddress({
          address: "",
          city: "",
          postalCode: "",
          country: "",
          isDefault: false,
        });
      },
    });
  };

  const handleUpdateAddress = (addressId: string) => {
    if (
      !newAddress.address ||
      !newAddress.city ||
      !newAddress.postalCode ||
      !newAddress.country
    ) {
      toast.error("Please fill in all address fields");
      return;
    }

    updateAddress.mutate(
      { addressId, data: newAddress },
      {
        onSuccess: () => {
          setEditingId(null);
          setNewAddress({
            address: "",
            city: "",
            postalCode: "",
            country: "",
            isDefault: false,
          });
        },
      }
    );
  };

  const handleEdit = (address: Address) => {
    setEditingId(address._id!);
    setNewAddress({
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
    });
    setIsAddingNew(false);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setIsAddingNew(false);
    setNewAddress({
      address: "",
      city: "",
      postalCode: "",
      country: "",
      isDefault: false,
    });
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-none">
      <CardHeader className="border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">
              Saved Addresses
            </CardTitle>
            <CardDescription className="text-sm">
              Manage your delivery addresses
            </CardDescription>
          </div>
          {!isAddingNew && !editingId && (
            <Button
              onClick={() => setIsAddingNew(true)}
              variant="outline"
              size="sm"
              className="rounded-none h-9"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {(isAddingNew || editingId) && (
          <div className="p-4 border-2 border-dashed border-gray-200 bg-gray-50 space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">
              {editingId ? "Edit Address" : "Add New Address"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  Street Address
                </Label>
                <Input
                  id="address"
                  value={newAddress.address}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, address: e.target.value })
                  }
                  className="h-10 rounded-none border-gray-200"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium">
                  City
                </Label>
                <Input
                  id="city"
                  value={newAddress.city}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, city: e.target.value })
                  }
                  className="h-10 rounded-none border-gray-200"
                  placeholder="New York"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode" className="text-sm font-medium">
                  Postal Code
                </Label>
                <Input
                  id="postalCode"
                  value={newAddress.postalCode}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, postalCode: e.target.value })
                  }
                  className="h-10 rounded-none border-gray-200"
                  placeholder="10001"
                />
              </div>

              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="country" className="text-sm font-medium">
                  Country
                </Label>
                <Input
                  id="country"
                  value={newAddress.country}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, country: e.target.value })
                  }
                  className="h-10 rounded-none border-gray-200"
                  placeholder="United States"
                />
              </div>

              <div className="md:col-span-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={newAddress.isDefault}
                  onChange={(e) =>
                    setNewAddress({
                      ...newAddress,
                      isDefault: e.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-gray-300"
                />
                <Label
                  htmlFor="isDefault"
                  className="text-sm font-medium cursor-pointer"
                >
                  Set as default address
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={handleCancelEdit}
                className="rounded-none h-9"
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  editingId
                    ? handleUpdateAddress(editingId)
                    : handleAddAddress()
                }
                disabled={addAddress.isPending || updateAddress.isPending}
                className="rounded-none h-9"
              >
                {addAddress.isPending || updateAddress.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update Address"
                ) : (
                  "Add Address"
                )}
              </Button>
            </div>
          </div>
        )}

        {addresses.length > 0 ? (
          <div className="space-y-3">
            {addresses.map((address) => (
              <div
                key={address._id}
                className="group p-4 border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      {address.isDefault && (
                        <Badge
                          variant="default"
                          className="rounded-none text-xs"
                        >
                          <Home className="h-3 w-3 mr-1" />
                          Default
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {address.address}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.postalCode}
                    </p>
                    <p className="text-sm text-gray-600">{address.country}</p>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(address)}
                      className="h-8 text-xs"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAddress.mutate(address._id!)}
                      disabled={deleteAddress.isPending}
                      className="h-8 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      {deleteAddress.isPending ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Trash2 className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : !isAddingNew ? (
          <div className="text-center py-12 border border-gray-200 bg-gray-50">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm font-medium text-gray-600 mb-1">
              No addresses saved
            </p>
            <p className="text-xs text-gray-500 mb-4">
              Add your first delivery address
            </p>
            <Button
              onClick={() => setIsAddingNew(true)}
              variant="outline"
              size="sm"
              className="rounded-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Address
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default AddressSection;
