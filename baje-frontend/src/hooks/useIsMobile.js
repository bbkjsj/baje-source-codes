import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { useState, useEffect } from "react";

export default function useIsMobile() {
  const screens = useBreakpoint();
  const [isMobile, setMobile] = useState(false);

  useEffect(() => {
    if (!screens.lg && !screens.xl && !screens.xxl && !screens.md) {
      setMobile(true);
    } else {
      setMobile(false);
    }
  }, [screens]);

  return isMobile;
}
