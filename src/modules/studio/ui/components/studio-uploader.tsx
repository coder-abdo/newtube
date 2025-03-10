import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { StudioUploaderProps } from "@/types";

export const StudioUploader: React.FC<StudioUploaderProps> = ({
  onSuccess,
  endpoint,
}) => {
  return (
    <div>
      <MuxUploader endpoint={endpoint} onSuccess={onSuccess} />
    </div>
  );
};
