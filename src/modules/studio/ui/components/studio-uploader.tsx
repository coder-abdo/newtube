import MuxUploader, {
  MuxUploaderDrop,
  MuxUploaderFileSelect,
  MuxUploaderProgress,
  MuxUploaderStatus,
} from "@mux/mux-uploader-react";
import { StudioUploaderProps } from "@/types";
import { UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export const StudioUploader: React.FC<StudioUploaderProps> = ({
  onSuccess,
  endpoint,
}) => {
  return (
    <div>
      <MuxUploader
        endpoint={endpoint}
        onSuccess={onSuccess}
        id="video-uploader"
        className="hidden group/uploader"
      />
      <MuxUploaderDrop muxUploader="video-uploader" className="group/drop">
        <div className="flex items-center flex-col gap-6" slot="heading">
          <div className="flex justify-center items-center gap-2 w-32 h-32 rounded-full bg-muted">
            <UploadIcon className="text-muted-foreground size-10 group/drop-[&[active]]:animate-bounce transition duration-300" />
          </div>
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm">drag and drop videos files to upload</p>
            <p className="text-xs text-muted-foreground">
              your videos will be private until you publish them
            </p>
          </div>
          <MuxUploaderFileSelect muxUploader="video-uploader">
            <Button type="button" className="rounded-full">
              Select File
            </Button>
          </MuxUploaderFileSelect>
        </div>
        <span slot="separator" className="hidden" />
        <MuxUploaderStatus muxUploader="video-uploader" className="text-sm" />
        <MuxUploaderProgress
          muxUploader="video-uploader"
          className="text-sm"
          type="percentage"
        />
        <MuxUploaderProgress
          muxUploader="video-uploader"
          className="text-sm"
          type="bar"
        />
      </MuxUploaderDrop>
    </div>
  );
};
