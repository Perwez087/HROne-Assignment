import React from "react";
import { Card, Empty } from "antd";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

interface JSONPreviewProps {
  data: Record<string, any>;
}

const JSONPreview: React.FC<JSONPreviewProps> = ({ data }) => {
  const isEmpty = Object.keys(data).length === 0;
  const formattedJSON = JSON.stringify(data, null, 2);

  return (
    <Card>
      {isEmpty ? (
        <Empty description="No JSON yet. Fill and submit fields." />
      ) : (
        <SyntaxHighlighter
          language="json"
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            fontSize: "14px",
            minHeight: "200px",
          }}
        >
          {formattedJSON}
        </SyntaxHighlighter>
      )}
    </Card>
  );
};

export default JSONPreview;
