import React from "react";
import { CCard, CCardBody, CCardHeader, CCol, CRow } from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { brandSet } from "@coreui/icons";
import { DocsIcons } from "src/components";
import "./Brands.css";

const toKebabCase = (str) => {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase();
};

export const getIconsView = (iconset) => {
  return Object.entries(iconset).map(([name, value]) => (
    <CCol className="mb-4 icon-col" xs={6} sm={4} md={3} xl={2} key={name}>
      <div className="icon-wrapper">
        <CIcon icon={value} size="xxl" className="brand-icon" />
        <div className="icon-name">{toKebabCase(name)}</div>
      </div>
    </CCol>
  ));
};

const CoreUIIcons = () => {
  return (
    <div className="brands-container">
      <DocsIcons />
      <CCard className="mb-4 brands-card">
        <CCardHeader className="brands-header">
          <h4 className="mb-0">Brand Icons</h4>
        </CCardHeader>
        <CCardBody>
          <CRow className="text-center icons-grid">
            {getIconsView(brandSet)}
          </CRow>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default CoreUIIcons;
