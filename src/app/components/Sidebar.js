import {
  BookTextIcon,
  CircleGaugeIcon,
  CircleXIcon,
  ClipboardListIcon,
  DatabaseIcon,
  HouseIcon,
  ShieldCheckIcon,
  Table2Icon,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import QualityLoss from "./QualLoss";
import QualLossPasteurizer from "./QualLossPasteurizer";
import QualityLossProcessing from "./QualLossProcessing";
import Quantity from "./Quantity";
import Speed from "./SpeedLoss";

function SidebarContent({ isOpen }) {
  const searchParams = useSearchParams();
  const [path, setPath] = useState("");
  const [quantityModal, setQuantityModal] = useState(false);
  const [qualityLossModal, setQualityLossModal] = useState(false);
  const [speedLossModal, setSpeedLossModal] = useState(false);
  const [lineValue, setLineValue] = useState(null);
  const [lineId, setLineId] = useState(null);
  const line = localStorage.getItem("line");
  const shift = localStorage.getItem("shift");
  const date = localStorage.getItem("date");
  const plant = localStorage.getItem("plant");
  const po = localStorage.getItem("selectedMaterial");
  const storedId = localStorage.getItem("id");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setLineValue(searchParams.get("value") || localStorage.getItem("line"));
      setLineId(searchParams.get("id") || localStorage.getItem("id"));
      setPath(window.location.pathname);
    }
  }, [searchParams]);

  let ident;
  if (po) {
    const selectedMaterial = JSON.parse(po);
    ident = selectedMaterial[0]?.id;
  } else if (storedId) {
    ident = storedId;
  }

  // Get main path only (/main, /order, /stoppage, etc)
  const getMainPath = (pathname) => {
    const parts = pathname.split("/").filter(Boolean);
    return parts.length > 0 ? `/${parts[0]}` : "/";
  };

  const mainPath = getMainPath(path);

  const navItems = [
    {
      label: "Home",
      href: `../../main?value=${lineValue}&id=${lineId || ident}`,
      basePath: "/main",
      show: !!po || !!storedId,
    },
    {
      label: "Manage Orders",
      action: () => {
        if (line && shift && date) {
          if (plant === "Milk Filling Packing") {
            window.location.href = `../../order/filling?value=${line}&shift=${shift}&date=${date}`;
          } else if (plant === "Milk Processing") {
            window.location.href = `../../order/processing?value=${line}&shift=${shift}&date=${date}`;
          } else if (plant === "Yogurt") {
            window.location.href = `../../order/yogurt?value=${line}&shift=${shift}&date=${date}`;
          } else if (plant === "Cheese") {
            window.location.href = `../../order/cheese?value=${line}&shift=${shift}&date=${date}`;
          }
        } else {
          window.location.href = "../../order";
        }
      },
      basePath: "/order",
      show: true,
    },
    {
      label: "Manage Downtime",
      href: `../../stoppage?value=${lineValue}&id=${lineId || ident}`,
      basePath: "/stoppage",
      show: true,
    },
    {
      label: "Insert Finished Goods",
      action: () => {
        if (path === "/main") {
          setQuantityModal(true);
        } else {
          alert("This action is only available on the Home page.");
        }
      },
      basePath: "/main",
      show: true,
    },
    {
      label: "Insert Quality Loss",
      action: () => {
        if (path === "/main") {
          setQualityLossModal(true);
        } else {
          alert("This action is only available on the Home page.");
        }
      },
      basePath: "/main",
      show: true,
    },
    {
      label: "Insert Speed Loss",
      action: () => {
        if (path === "/main") {
          setSpeedLossModal(true);
        } else {
          alert("This action is only available on the Home page.");
        }
      },
      basePath: "/main",
      show: true,
    },
    {
      label: "Downtime Report",
      href: "../../report",
      basePath: "/report",
      show: true,
    },
    {
      label: "Performance Report",
      href: "../../performance",
      basePath: "/performance",
      show: true,
    },
    {
      label: "Master Downtime",
      href: "../../masterDowntime",
      basePath: "/masterDowntime",
      show: true,
    },
  ];

  const renderIcon = (label) => {
    switch (label) {
      case "Home":
        return <HouseIcon className="size-4 mr-4" />;
      case "Manage Orders":
        return <BookTextIcon className="size-4 mr-4" />;
      case "Manage Downtime":
        return <CircleXIcon className="size-4 mr-4" />;
      case "Insert Finished Goods":
        return <ClipboardListIcon className="size-4 mr-4" />;
      case "Insert Quality Loss":
        return <ShieldCheckIcon className="size-4 mr-4" />;
      case "Insert Speed Loss":
        return <CircleGaugeIcon className="size-4 mr-4" />;
      case "Downtime Report":
        return <Table2Icon className="size-4 mr-4" />;
      case "Performance Report":
        return <Table2Icon className="size-4 mr-4" />;
      case "Master Downtime":
        return <DatabaseIcon className="size-4 mr-4" />;
      default:
        return null;
    }
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-10 ${
        isOpen ? "w-64" : "w-16"
      } transition-width duration-300 flex-col border-r bg-white pt-16`}
    >
      <div
        className={`flex flex-col space-y-4 p-4 ${isOpen ? "block" : "hidden"}`}
      >
        {navItems
          .filter((item) => item.show)
          .map((item, index) => {
            const isActive =
              mainPath === item.basePath &&
              item.label !== "Insert Finished Goods" &&
              item.label !== "Insert Quality Loss" &&
              item.label !== "Insert Speed Loss";

            return (
              <Link
                key={index}
                href={item.href || "#"}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-200 rounded"
                onClick={(e) => {
                  if (item.action) {
                    e.preventDefault();
                    item.action();
                  }
                }}
              >
                {renderIcon(item.label)}
                <span
                  className={`transition-colors duration-200 ${
                    isActive ? "text-green-500 font-bold" : ""
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
      </div>

      {quantityModal && <Quantity onClose={() => setQuantityModal(false)} />}
      {qualityLossModal && (
        <>
          {plant === "Milk Processing" ? (
            <QualityLossProcessing onClose={() => setQualityLossModal(false)} />
          ) : plant === "Milk Filling Packing" ? (
            <QualityLoss onClose={() => setQualityLossModal(false)} />
          ) : plant === "Cheese" ? (
            <QualityLoss onClose={() => setQualityLossModal(false)} />
          ) : plant === "Yogurt" && line !== "PASTEURIZER" ? (
            <QualityLoss onClose={() => setQualityLossModal(false)} />
          ) : plant === "Yogurt" && line === "PASTEURIZER" ? (
            <QualLossPasteurizer onClose={() => setQualityLossModal(false)} />
          ) : null}
        </>
      )}
      {speedLossModal && <Speed onClose={() => setSpeedLossModal(false)} />}
    </aside>
  );
}

export default function Sidebar({ isOpen }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SidebarContent isOpen={isOpen} />
    </Suspense>
  );
}
