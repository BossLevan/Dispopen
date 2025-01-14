import { Button } from "react-native";
import { useCallsStatus, useShowCallsStatus } from "wagmi/experimental";

export function CallStatus({ id }: { id: string }) {
  const { data: callsStatus } = useCallsStatus({
    id,
    query: {
      refetchInterval: (data) =>
        data.state.data?.status === "CONFIRMED" ? false : 1000,
    },
  });
  const { showCallsStatus } = useShowCallsStatus();

  return (
    <div>
      <p>Status: {callsStatus?.status || "loading"}</p>
      <Button title="View in Wallet" onPress={() => showCallsStatus({ id })} />
    </div>
  );
}
