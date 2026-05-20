import { Pressable, Text, View } from "react-native"

type RangeSelectorProps<Range extends string = string> = {
  ranges: Range[]
  selectedRange: Range
  onSelect: (range: Range) => void
}

export function RangeSelector<Range extends string = string>({
  ranges,
  selectedRange,
  onSelect,
}: RangeSelectorProps<Range>) {
  return (
    <View className="mt-8 flex-row gap-2 px-4">
      {ranges.map((range) => {
        const isActive = range === selectedRange

        return (
          <Pressable
            key={range}
            onPress={() => onSelect(range)}
            className={`flex-1 items-center rounded-full border border-white/10 py-2 ${
              isActive ? "bg-white" : "bg-transparent"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                isActive ? "text-font-secundary" : "text-gray-400"
              }`}
            >
              {range}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}