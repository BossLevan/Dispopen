// import { IProps } from "@/constants/types";
// import { Ellipsis } from "lucide-react-native";
// import { Pressable } from "react-native/Libraries/Components/Pressable/Pressable";
// import * as DropdownMenu from "zeego/dropdown-menu";

// export default function ContextMenuButton({
//   size = 20,
//   actions: groups, // While it made more sense to call this `actions` in the props type, when we use it in the component I prefer to call it `groups`. This might be confusing to you, so feel free to either change the name in the type or the component...
//   children,
// }: IProps): React.JSX.Element {
//   return (
//     <DropdownMenu.Root>
//     <DropdownMenu.Trigger>
//       {children ?? (
//         <Pressable hitSlop={5}>
//           <Ellipsis size={size} color="white" />
//         </Pressable>
//       )}
//     </DropdownMenu.Trigger>
//     <DropdownMenu.Content>
//       {groups.map((group, index) => (
//         <DropdownMenu.Group key={index}>
//           {groups.actions.map((action) => {
//             if (action.actions != null) {
//               return (
//                 <DropdownMenu.Sub key={action.key}>
//                   {/* First we need to add the sub trigger and sub component block */}
//                   <DropdownMenu.SubTrigger
//                     key={action.key + 'trigger'}
//                     destructive={action.destructive}
//                   >
//                     {action.label}
//                   </DropdownMenu.SubTrigger>
//                   <DropdownMenu.SubContent key={action.key + 'content'}>
//                     {actions.actions.map((subAction) => (
//                       <DropdownMenu.Item
//                         key={subAction.key}
//                         onSelect={subAction.onSelect}
//                         destructive={subAction.destructive}
//                       >
//                         <DropdownMenu.ItemTitle>
//                           {subAction.label}
//                         </DropdownMenu.ItemTitle>
//                         <DropdownMenu.ItemIcon
//                           ios={subAction.iosIconName != null ? { name: subAction.iconName! } : undefined}
//                           android={subAction.androidIconName}
//                         />
//                       </DropdownMenu.Item>
//                     )}
//                   </DropdownMenu.SubContent>
//                 </DropdownMenu.Sub>
//               );
//             } else {
//               return (
//                 <DropdownMenu.Item
//                   key={action.key}
//                   destructive={action.destructive}
//                   onSelect={action.onSelect}
//                 >
//                   {/* All we have to render here is the ItemTitle and ItemIcon */}
//                   <DropdownMenu.ItemTitle>
//                     {action.label}
//                   </DropdownMenu.ItemTitle>
//                   <DropdownMenu.ItemIcon
//                     ios={action.iosIconName != null ? { name: action.iconName! } : undefined}
//                     android={action.androidIconName}
//                   />
//                 </DropdownMenu.Item>
//               );
//             }
//           }}
//         </DropdownMenu.Group>
//       )}
//     </DropdownMenu.Content>
//   </DropdownMenu.Root>

//   );
// }
