import React, { useState, useRef, useEffect } from "react";
import { Layout, Row, Col, Typography, Button, Card, Grid, Tooltip, Empty, Space } from "antd";
import { PlusOutlined, DownloadOutlined } from "@ant-design/icons";
import FieldItem from "./FieldItem";
import type { SchemaField } from "../types/schemaTypes";
import { createDefaultField } from "../utils/createDefaultField";
import { generateJsonPreview } from "../utils/generateJson";
import JSONPreview from "../JSONPreview";

const { Title, Paragraph } = Typography;
const { Header, Content } = Layout;
const { useBreakpoint } = Grid;

const SchemaBuilder: React.FC = () => {
  const [schema, setSchema] = useState<SchemaField[]>([]);
  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const containerRef = useRef<HTMLDivElement>(null);

  const updateField = (id: string, updated: Partial<SchemaField>, fields = schema): SchemaField[] =>
    fields.map((field) => {
      if (field.id === id) {
        return { ...field, ...updated };
      } else if (field.type === "nested" && field.children) {
        return { ...field, children: updateField(id, updated, field.children) };
      }
      return field;
    });

  const handleUpdate = (id: string, updated: Partial<SchemaField>) =>
    setSchema(updateField(id, updated));

  const addField = (parentId?: string) => {
    const newField = createDefaultField();
    if (!parentId) {
      setSchema((prev) => [...prev, newField]);
    } else {
      const addNested = (fields: SchemaField[]): SchemaField[] =>
        fields.map((field) => {
          if (field.id === parentId) {
            return {
              ...field,
              children: [...(field.children || []), newField],
            };
          } else if (field.children) {
            return { ...field, children: addNested(field.children) };
          }
          return field;
        });
      setSchema(addNested(schema));
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [schema]);

  const deleteField = (id: string, fields = schema): SchemaField[] =>
    fields
      .filter((field) => field.id !== id)
      .map((field) => ({
        ...field,
        children: field.children ? deleteField(id, field.children) : undefined,
      }));

  const handleDelete = (id: string) => setSchema(deleteField(id));

  const renderFields = (fields: SchemaField[], parentId?: string) =>
    fields.map((field) => (
      <FieldItem
        key={field.id}
        field={field}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        onAddNested={addField}
        renderChildren={renderFields}
      />
    ));

  const handleExport = () => {
    const jsonData = JSON.stringify(generateJsonPreview(schema), null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "schema.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          background: "#001529",
          padding: "0 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Title
          level={isMobile ? 4 : 3}
          style={{
            color: "white",
            margin: "10px 0",
            textAlign: isMobile ? "center" : "left",
            flex: isMobile ? "1 0 100%" : "auto",
          }}
        >
          {isMobile ? "JSON Schema" : "JSON Schema Builder"}
        </Title>

        <Space>
          {!isMobile && (
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              Export JSON
            </Button>
          )}

          {isMobile ? (
            <Tooltip title="Add Field">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                shape="circle"
                onClick={() => addField()}
              />
            </Tooltip>
          ) : (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => addField()}
            >
              Add Field
            </Button>
          )}
        </Space>
      </Header>

      <Content style={{ padding: "16px", background: "#f0f2f5" }}>
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={24} md={12}>
            <Card
              title="Schema Fields"
              bordered={false}
              style={{ minHeight: "300px" }}
              bodyStyle={{
                maxHeight: "70vh",
                overflowY: "auto",
              }}
              ref={containerRef}
            >
              {schema.length === 0 ? (
                <Empty description="No fields yet. Click Add Field to start." />
              ) : (
                renderFields(schema)
              )}
            </Card>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Card
              title="JSON Preview"
              bordered={false}
              style={{ minHeight: "300px" }}
              bodyStyle={{
                maxHeight: "70vh",
                overflowY: "auto",
              }}
            >
              <JSONPreview data={generateJsonPreview(schema)} />
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default SchemaBuilder;
