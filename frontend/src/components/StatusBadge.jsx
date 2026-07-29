import { Clock, CheckCircle2, XCircle, Award } from "lucide-react";

export const StatusBadge = ({ status = "Pending" }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case "Approved":
      case "Accepted":
      case "Completed":
      case "Paid":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Rejected":
      case "Failed":
        return "bg-rose-100 text-rose-700 border-rose-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const getIcon = () => {
    switch (status) {
      case "Approved":
      case "Accepted":
      case "Completed":
      case "Paid":
        return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case "Rejected":
      case "Failed":
        return <XCircle className="w-3 h-3 mr-1" />;
      case "Premium":
        return <Award className="w-3 h-3 mr-1" />;
      default:
        return <Clock className="w-3 h-3 mr-1" />;
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()}`}>
      {getIcon()}
      {status}
    </span>
  );
};
