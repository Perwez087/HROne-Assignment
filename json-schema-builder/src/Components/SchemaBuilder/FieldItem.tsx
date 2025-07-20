import React, { useState } from "react";
import { Button, Select, Input, Space, Card, Tooltip, Grid } from "antd";
import { DeleteOutlined, PlusOutlined, EditOutlined, CheckOutlined } from "@ant-design/icons";
import type { SchemaField } from "../types/schemaTypes";

const { Option } = Select;
const { useBreakpoint } = Grid;

interface FieldItemProps {
  field: SchemaField;
  onUpdate: (id: string, updated: Partial<SchemaField>) => void;
  onDelete: (id: string) => void;
  onAddNested: (parentId: string) => void;
  renderChildren: (fields: SchemaField[], parentId: string) => React.ReactNode;
}

const FieldItem: React.FC<FieldItemProps> = ({
  field,
  onUpdate,
  onDelete,
  onAddNested,
  renderChildren,
}) => {
  const screens = useBreakpoint();
  const isMobile = !screens.md; 

  const [tempKey, setTempKey] = useState(field.key);
  const isSaved = field.key.trim() !== "";

  const handleSubmit = () => {
    if (!tempKey.trim()) return;
    onUpdate(field.id, { key: tempKey });
  };

  const handleEdit = () => {
    onUpdate(field.id, { key: "" });
    setTempKey("");
  };

  return (
    <Card
      size="small"
      style={{ marginBottom: 12 }}
      title={isSaved ? "Saved Field" : "Unsaved Field"}
      extra={
        <Space>
          {isSaved && (
            <Tooltip title="Edit field name">
              <Button size="small" icon={<EditOutlined />} onClick={handleEdit} />
            </Tooltip>
          )}
          <Tooltip title="Delete this field">
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
              onClick={() => onDelete(field.id)}
            />
          </Tooltip>
        </Space>
      }
    >
      <Space
        direction={isMobile ? "vertical" : "horizontal"}
        style={{ width: "100%" }}
      >
        <Input
          style={{ flex: 1, minWidth: isMobile ? "100%" : "180px" }}
          placeholder="Enter field name"
          value={tempKey}
          disabled={isSaved}
          onChange={(e) => setTempKey(e.target.value)}
        />

        <Select
          style={{ width: isMobile ? "100%" : "140px" }}
          value={field.type}
          onChange={(val) =>
            onUpdate(
              field.id,
              val === "nested"
                ? { type: val, children: [] }
                : { type: val, children: undefined }
            )
          }
        >
          <Option value="string">String</Option>
          <Option value="number">Number</Option>
          <Option value="nested">Nested</Option>
        </Select>

        {!isSaved && (
          <Button
            type="primary"
            icon={<CheckOutlined />}
            onClick={handleSubmit}
            style={{ width: isMobile ? "100%" : "auto" }}
          >
            {!isMobile && "Submit"}
          </Button>
        )}
      </Space>

      {field.type === "nested" && (
        <div style={{ marginLeft: 20, marginTop: 10 }}>
          {renderChildren(field.children || [], field.id)}
          <Button
            type="dashed"
            size="small"
            icon={<PlusOutlined />}
            style={{
              marginTop: 8,
              width: isMobile ? "100%" : "auto",
            }}
            onClick={() => onAddNested(field.id)}
          >
            {isMobile ? "Add Nested" : "Add Nested Field"}
          </Button>
        </div>
      )}
    </Card>
  );
};

export default FieldItem;
