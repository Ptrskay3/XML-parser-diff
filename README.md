# Comparison of XML -> JSON converters

## TL;DR;

| Parser          | basic.xml time (ms) | basic.xml memory (MB) | stress.xml time (ms) | stress.xml memory (MB) |
| --------------- | ------------------- | --------------------- | -------------------- | ---------------------- |
| Fast-XML-Parser | 79.13               | 3.28                  | 352.12               | 14.04                  |
| XML-JS          | 88.76               | 3.17                  | 351.66               | 14.23                  |
| XML2JS          | 85.80               | 3.74                  | 392.39               | 34.16                  |
| Rust            | 51.68               | 2.66                  | 116.69               | 10.09                  |

Note that `XML-JS` and `XML2JS` do _not_ parse numbers.
Using our Rust based parser is both better in terms of performance, and the scheme is much more flexible.

## In detail

We will use this element as an example:

```xml
<formatted_text id="DBJHVYNWOBAG" created_time="2021-11-27 18:03:47" modified_time="2021-11-27 18:03:48" x="951.735" y="269.945" width="217.254" height="105.292" transform="matrix(1 0 0 1 293.169 -259.039)" valign="center" line_snap="on">
   <no_fill opacity="0.8" />
   <text_padding_font_size_relative ratio="0.1"/>
   <text_body>
         <text_paragraph halign="center">
            <text_run>
               <run_props font_name="Arial" font_size="78" italic="false" keyboard_lang="ar">
                     <text_color>
                        <argb_color color="#000000"/>
                     </text_color>
               </run_props>
               <text>
                     Körte
               </text>
            </text_run>
         </text_paragraph>
   </text_body>
</formatted_text>
```

### Rust:

The generated JSON:

```json
{
  "id": "DBJHVYNWOBAG",
  "created_time": "2021-11-27 18:03:47",
  "modified_time": "2021-11-27 18:03:48",
  "x": 951.735,
  "y": 269.945,
  "width": 217.254,
  "height": 105.292,
  "transform": "matrix(1 0 0 1 293.169 -259.039)",
  "valign": "center",
  "line_snap": "on",
  "no_fill": { "opacity": 0.8 },
  "solid_fill": false,
  "text_padding_font_size_relative": { "ratio": 0.1 },
  "text_body": {
    "paragraphs": [
      {
        "halign": "center",
        "elements": [
          {
            "font_name": "Arial",
            "font_size": 78,
            "italic": false,
            "keyboard_lang": "ar",
            "text_color": { "argb_color": { "color": "#000000" } },
            "text": "Körte",
            "__type": "text_run"
          }
        ]
      }
    ]
  },
  "__type": "formatted_text"
}
```

#### basic.xml

```
mem: 2.66 MB

________________________________________________________
Executed in   51.68 millis    fish           external
   usr time   39.47 millis    3.75 millis   35.72 millis
   sys time   13.18 millis    4.00 millis    9.18 millis
```

#### stress.xml

```
mem: 10.09 MB

________________________________________________________
Executed in  116.69 millis    fish           external
   usr time  100.75 millis    6.54 millis   94.21 millis
   sys time   25.64 millis    1.30 millis   24.35 millis
```

### Fast-XML-Parser:

- [+] Relatively fast
- [-] Produces this horrible structure when order is preserved:

The generated JSON:

```json
{
  "formatted_text": [
    { "no_fill": [], ":@": { "@_opacity": 0.8 } },
    { "text_padding_font_size_relative": [], ":@": { "@_ratio": 0.1 } },
    {
      "text_body": [
        {
          "text_paragraph": [
            {
              "text_run": [
                {
                  "run_props": [{ "text_color": [{ "argb_color": [], ":@": { "@_color": "#000000" } }] }],
                  ":@": {
                    "@_font_name": "Arial",
                    "@_font_size": 78,
                    "@_italic": false,
                    "@_keyboard_lang": "ar"
                  }
                },
                { "text": [{ "#text": "Körte" }] }
              ]
            }
          ],
          ":@": { "@_halign": "center" }
        }
      ]
    }
  ],
  ":@": {
    "@_id": "DBJHVYNWOBAG",
    "@_created_time": "2021-11-27 18:03:47",
    "@_modified_time": "2021-11-27 18:03:48",
    "@_x": 951.735,
    "@_y": 269.945,
    "@_width": 217.254,
    "@_height": 105.292,
    "@_transform": "matrix(1 0 0 1 293.169 -259.039)",
    "@_valign": "center",
    "@_line_snap": "on"
  }
}
```

#### basic.xml

```
mem: 3.28 MB

________________________________________________________
Executed in   79.13 millis    fish           external
   usr time   72.16 millis    6.71 millis   45.45 millis
   sys time   13.41 millis    1.49 millis   11.92 millis

```

#### stress.xml

```
mem: 14.04 MB

________________________________________________________
Executed in  352.12 millis    fish           external
   usr time  285.42 millis    0.00 millis  285.42 millis
   sys time   71.42 millis   18.80 millis   52.62 millis
```

# XML-JS

- [+] Relatively fast
- [-] No number parsing
- [-] Too much nesting that cannot be controlled

The generated JSON:

```json
{
  "type": "element",
  "name": "formatted_text",
  "attributes": {
    "id": "DBJHVYNWOBAG",
    "created_time": "2021-11-27 18:03:47",
    "modified_time": "2021-11-27 18:03:48",
    "x": "951.735",
    "y": "269.945",
    "width": "217.254",
    "height": "105.292",
    "transform": "matrix(1 0 0 1 293.169 -259.039)",
    "valign": "center",
    "line_snap": "on"
  },
  "elements": [
    { "type": "element", "name": "no_fill", "attributes": { "opacity": "0.8" }, "elements": [] },
    {
      "type": "element",
      "name": "text_padding_font_size_relative",
      "attributes": { "ratio": "0.1" },
      "elements": []
    },
    {
      "type": "element",
      "name": "text_body",
      "elements": [
        {
          "type": "element",
          "name": "text_paragraph",
          "attributes": { "halign": "center" },
          "elements": [
            {
              "type": "element",
              "name": "text_run",
              "elements": [
                {
                  "type": "element",
                  "name": "run_props",
                  "attributes": {
                    "font_name": "Arial",
                    "font_size": "78",
                    "italic": "false",
                    "keyboard_lang": "ar"
                  },
                  "elements": [
                    {
                      "type": "element",
                      "name": "text_color",
                      "elements": [
                        {
                          "type": "element",
                          "name": "argb_color",
                          "attributes": { "color": "#000000" },
                          "elements": []
                        }
                      ]
                    }
                  ]
                },
                { "type": "element", "name": "text", "elements": [{ "type": "text", "text": "Körte" }] }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

#### basic.xml

```
mem: 3.17 MB

________________________________________________________
Executed in   88.76 millis    fish           external
   usr time   56.39 millis    2.73 millis   53.66 millis
   sys time   34.84 millis   13.60 millis   21.24 millis
```

#### stress.xml

```
mem: 14.23 MB

________________________________________________________
Executed in  351.66 millis    fish           external
   usr time  376.36 millis   10.51 millis  365.85 millis
   sys time   52.48 millis    6.92 millis   45.56 millis
```

### XML2JS

I will _not_ copy paste the generated JSON here, because it'd make this document unreadable.
See `xml2js.json` if interested..

#### basic.xml

```
mem: 3.74 MB

________________________________________________________
Executed in   85.80 millis    fish           external
   usr time   76.10 millis    6.83 millis   69.28 millis
   sys time    9.50 millis    0.00 millis    9.50 millis
```

#### stress.xml

```
mem: 34.16 MB

________________________________________________________
Executed in  392.39 millis    fish           external
   usr time  501.88 millis    8.55 millis  493.33 millis
   sys time   65.05 millis    8.63 millis   56.42 millis
```
