import React from "react";
import { GoogleLogin } from "@react-oauth/google";

export function GoogleButton({ onCredential, disabled }) {
  return (
    <div className={disabled ? "pointer-events-none opacity-60" : ""}>
      <div className="rounded-xl overflow-hidden border border-white/10 bg-white/5">
        <GoogleLogin
          onSuccess={(credentialResponse) => onCredential?.(credentialResponse?.credential)}
          onError={() => onCredential?.(null, true)}
          useOneTap={false}
          ux_mode="popup" // stay in same tab (no redirect)
          theme="filled_black"
          size="large"
          width="100%"
          text="continue_with"
        />
      </div>
      <div className="mt-2 text-[11px] text-slate-400">
        Google sign-in ensures the email is real and verified.
      </div>
    </div>
  );
}

