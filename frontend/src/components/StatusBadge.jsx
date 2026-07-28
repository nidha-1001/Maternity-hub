import React from "react";
import { getStatusBadgeClass } from "../utils/helpers";
import { Clock, CheckCircle2, XCircle, Award } from "lucide-react";

export const StatusBadge = ({ status = "Pending" }) => {
  const badgeClass = getStatusBadgeClass(status);

  const getIcon = () => {
    switch ((status || "").toLowerCase()) {
      case "pending":
        return <Clock className="w-3.5 h-3.5" />;
      case "accepted":
      case "approved":
      case "paid":
        return <CheckCircle2 className="w-3.5 h-3.5" />;
      case "rejected":
      case "failed":
        return <XCircle className="w-3.5 h-3.5" />;
      case "completed":
        return <Award className="w-3.5 h-3.5" />;
      default:
        return <Clock className="w-3.5 h-3.5" />;
    }
  };

  return (
    <span className={`badge ${badgeClass}`}>
      {getIcon()}
      {status}
    </span>
  );
};
