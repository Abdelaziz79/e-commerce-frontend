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
    <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-4">
        <CardTitle className="flex items-center gap-2.5 text-lg font-semibold text-gray-900">
          <div className="p-2 rounded-lg bg-violet-50">
            <ListChecks className="h-4 w-4 text-violet-600" />
          </div>
          Product Specifications
        </CardTitle>
        <p className="text-sm text-gray-500">
          Add detailed specifications and technical attributes
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Add Attribute Form */}
        <div className="p-5 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/30 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">
            Add Specification
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
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
                placeholder="e.g., Processor, Screen Size"
                className="h-10 border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
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
                placeholder="e.g., Intel Core i7, 15.6 inches"
                className="h-10 border-gray-200 focus:border-violet-500 focus:ring-violet-500/20"
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
              className="bg-violet-600 hover:bg-violet-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Attribute
            </Button>
          </div>
        </div>

        {/* Attributes List */}
        {Object.keys(attributes).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">
                Added Specifications ({Object.keys(attributes).length})
              </h3>
            </div>
            <div className="space-y-2">
              {Object.entries(attributes).map(([key, value]) => (
                <div
                  key={key}
                  className="group flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-lg hover:shadow-sm hover:border-violet-200 transition-all"
                >
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Name:
                      </span>
                      <span className="font-semibold text-sm text-gray-900 capitalize truncate">
                        {key.replace(/_/g, " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500 uppercase tracking-wide">
                        Value:
                      </span>
                      <span className="text-sm text-gray-700 truncate">
                        {value}
                      </span>
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
        )}

        {Object.keys(attributes).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <ListChecks className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p className="text-sm">No specifications added yet</p>
            <p className="text-xs mt-1">Add technical details above</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
