---
note_type: other
categories: []
created: 2026-04-19
modified: 2026-04-19
tags: []
---
# Embedded-Cpp #FW-References

Constexpr map! For compile time lookup!

- [video](https://youtu.be/INn3xa4pMfg?si=EK-QFNzac95Uzzle)

```cpp fold title:constexpr_map.cpp
template <typename Key, typename Value, std::size_t Size>
struct Map {
  std::array<std::pair<Key, Value>, Size> data;

  [[nodiscard]] constexpr Value at(const Key &key) const {
    const auto itr =
        std::find_if(begin(data), end(data),
                     [&key](const auto &v) { return v.first == key; });
    if (itr != end(data)) {
      return itr->second;
    } else {
      throw std::range_error("Not Found");
    }
  }

};

using namespace std::literals::string_view_literals;
static constexpr std::array<std::pair<std::string_view, int>, 8> color_values{
    {{"black"sv, 7},
     {"blue"sv, 3},
     {"cyan"sv, 5},
     {"green"sv, 2},
     {"magenta"sv, 6},
     {"red"sv, 1},
     {"white"sv, 8},
     {"yellow"sv, 4}}};

int lookup_value(const std::string_view sv) {
  //static const auto map = std::map<std::string_view, int>{color_values.begin(), color_values.end()};
  static constexpr auto map =
      Map<std::string_view, int, color_values.size()>{{color_values}};

  return map.at(sv);
}
```

**Videos:

- [Playlist on constexpr from C++
  weekly:](https://www.youtube.com/watch?v=UdwdJWQ5o78&list=PLs3KjaCtOwSaqPapPV4pc1SRjypnwrXYV)

- [Constinit and static initialization of global static
  objects](https://youtu.be/rEwijXgC_Kg?si=DnUTLuEjSqQU2oUK)

- [Constexpr unique ptr:](https://youtu.be/p8Q-bapMShs?si=ZhRooMaFSVeq-eHb)

- [Static lambdas better than static
  functions](https://youtu.be/M_AUMiSbAwQ?si=MFhezt0RiSAqLG1J)

- [All the methods to use constexpr and make function run at compile
  time](https://youtu.be/UdwdJWQ5o78?si=aJYPr_BqWEOsglCZ)

- [Constexpr for virtual methods](https://youtu.be/JXJg_XMJFW0?si=HUE0q8bHc_KUF5-K)

**Articles:**

- [Constinit for factory methods to register static
  classes](https://www.cppstories.com/2023/ub-factory-constinit/)

- [Static smart pointer (unique ptr allocated in the stack instead of
  heap)](https://pvs-studio.com/en/blog/posts/cpp/0983/)



```cpp
namespace example {
 struct Base {

     virtual constexpr int get_value() const = 0;
     virtual ~Base() = default;
 };


 struct Derived : Base {

     [[nodiscard]] constexpr int get_value() const override {
         return 1;
     }
 };


 struct Derived2 : Base {

     [[nodiscard]] constexpr int get_value() const override {
         return 10;
     }
 };


 constexpr auto get_some_values() {


     const Derived d2;
     const Derived d;
     const Derived d3;
     const Derived2 d4;
     const Derived2 d5;

     const std::array<const Base*, 5> data{&d, &d2, &d3, &d4, &d5};
     int sum = 0;

     for (const auto* elem : data) {
         sum += elem->get_value();
     }

     return sum;

 }


 static_assert(get_some_values() == 1 + 1 + 1 + 10 + 10, "Sum should match constexpr evaluation");


 int main() {

     constexpr int result = get_some_values();
     static_assert(result == 23, "Expected sum is 23");
     return 0;

 }
}
```

**Important to save binary size!
Inline Constexpr in header files!** ![[constexpr_static_inline_rule.jpeg]]

Avoid dangling references using views

```cpp fold title:dangling references

//BAD
const char& find_second(const std: string& str, char c) {
//GOOD
const char& find_second(const std: string_view& str, char c) {

static char not_found = '\0';

size_t idx = str.find(c);

if (idx == std::string::npos) return not_found;

idx = str.find(c, idx+1);

if (idx == std:: string::npos) return not_found;

return stridx];

}

const char &c = find_second ("Hello World!", '0');
```

Ranges and references

Good overview of ranges:
[video](https://github.com/philsquared/cpponsea2024-slides/blob/main/Presentations/What_Is_A_Range.pdf)

<https://compiler-explorer.com/z/E5cMG4qqT>

Use universal references to pass in ranges to avoid views and Rvalue references

```cpp fold title:ranges and references

auto it1 = std:: ranges:: find(std::string_view("Hello World!"), '0');

// decltype(it1) == std::string_view::iterator

// *it1 == 'o'

auto it2 = std:: ranges::find(std::string("Hello World!"), '0');

// decltype(it2) == std::ranges::dangling

std: :string str1("Hello World!");

auto it3 = std: :ranges:: find(str1, '0');

// decltype(it3) == std::string::iterator

std::string_view str2("Hello World!");

auto it4 = std:: ranges:: find(str2, '0');

// decltype(it4) == std::string_view::iterator


void fun(auto&& rng) {

if constexpr (std:: ranges::borrowed_range<decltype(rng) >) {

// borrowing

} else i

/I taking ownership

}

fun(std::string(""));

// taking ownership

fun(std::string_view("")); // borrowing

std:: string str;

fun (str);

// borrowing

fun (std: :as_const(str)); // borrowing

https://compiler-explorer.com/z/h436jzTaq


//Not a borrowed range

std:: vector<int> data 1, 2,3,4,55;

auto rng1 = std: :views: :all(data);

// borrowed, decltype(rng1) == std::ranges::ref_view<...>

auto rng2 = std:: views: :all(std::vector<int >{1,2,3,4,5});

/I not borrowed, decltype(rng2) == std::ranges: :owning_views...>

https://compiler-explorer.com/z/T74ffK1dz
```
