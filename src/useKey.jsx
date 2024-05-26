import { useEffect } from "react";

export function useKey(key, callback) {
    useEffect(
        function () {
          const closeEventHandler = function (e) {
            if (e.key === key) {
              callback();
            }
          };
    
          document.addEventListener('keydown', closeEventHandler);
    
          return function () {
            document.removeEventListener('keydown', closeEventHandler);
          };
        },
        [key, callback]
      );
}