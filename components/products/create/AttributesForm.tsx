// app/admin/products/create/components/AttributesForm.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ListChecks, Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface AttributesFormProps {
  attributes: Record<string, string>;
  onAttributesChange: (attributes: Record<string, string>) => void;
}

export function AttributesForm({
  attributes,
  onAttributesChange,
}: AttributesFormProps) {
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleAdd = () => {
    if (newKey.trim() && newValue.trim()) {
      onAttributesChange({ ...attributes, [newKey.trim()]: newValue.trim() });
      setNewKey("");
      setNewValue("");
    }
  };

  const handleRemove = (keyToRemove: string) => {
    const newAttributes = { ...attributes };
    delete newAttributes[keyToRemove];
    onAttributesChange(newAttributes);
  };

  return (
    <Card className="border border-gray-200 shadow-sm rounded-none">
      <CardHeader className="border-b border-gray-200">
        <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-900">
          <ListChecks className="h-4 w-4 text-gray-500" />
          Product Specifications
        </CardTitle>
      </CardHeader>
      <CardContent className="p-5 space-y-5">
        {/* Add Attribute Form */}
        <div className="p-4 border-2 border-dashed border-gray-200 bg-gray-50 space-y-3">
          <h3 className="text-xs font-semibold text-gray-900">
            Add Specification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label
                htmlFor="attrKey"
                className="text-xs font-medium text-gray-700"
              >
                Attribute Name
              </Label>
              <Input
                id="attrKey"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="e.g., Processor"
                className="h-9 text-sm border-gray-200 rounded-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
              />
            </div>
            <div className="space-y-1.5">
              <Label
                htmlFor="attrVal"
                className="text-xs font-medium text-gray-700"
              >
                Attribute Value
              </Label>
              <Input
                id="attrVal"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder="e.g., Intel Core i7"
                className="h-9 text-sm border-gray-200 rounded-none"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={handleAdd}
              disabled={!newKey.trim() || !newValue.trim()}
              className="text-xs h-9 rounded-none"
            >
              <Plus className="h-3 w-3 mr-1.5" />
              Add Attribute
            </Button>
          </div>
        </div>

        {/* Attributes List */}
        {Object.keys(attributes).length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-900">
              Added Specifications ({Object.keys(attributes).length})
            </h3>
            <div className="space-y-2">
              {Object.entries(attributes).map(([key, value]) => (
                <div
                  key={key}
                  className="group flex items-center gap-3 p-3 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0 text-xs">
                    <div>
                      <span className="text-gray-500 uppercase">Name:</span>{" "}
                      <span className="font-semibold text-gray-900 capitalize">
                        {key.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 uppercase">Value:</span>{" "}
                      <span className="text-gray-700">{value}</span>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    onClick={() => handleRemove(key)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border border-gray-200 bg-gray-50">
            <ListChecks className="h-10 w-10 mx-auto mb-2 text-gray-300" />
            <p className="text-xs text-gray-500">No specifications added</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
