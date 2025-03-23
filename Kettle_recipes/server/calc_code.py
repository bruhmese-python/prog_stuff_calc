import uno

# Get the UNO component context from the PyUNO runtime
localContext = uno.getComponentContext()

# Create the UnoUrlResolver to connect to the running LibreOffice instance
resolver = localContext.ServiceManager.createInstanceWithContext(
    "com.sun.star.bridge.UnoUrlResolver", localContext)

# Connect to the running LibreOffice instance
ctx = resolver.resolve("uno:socket,host=localhost,port=2002;urp;StarOffice.ComponentContext")
smgr = ctx.ServiceManager

# Get the central desktop object
desktop = smgr.createInstanceWithContext("com.sun.star.frame.Desktop", ctx)

# Access the current spreadsheet document
model = desktop.getCurrentComponent()

# Access the active sheet
active_sheet = model.CurrentController.ActiveSheet

# Access cell A2
cell = active_sheet.getCellRangeByName("A2")

print(cell.Hyperlink)

# Get the text object from the cell
text = cell.Text
print(text.Hyperlink)

# Access the TextFields collection of the Text object to find hyperlinks
text_fields = text.TextFields

# Iterate through the TextFields to find any Hyperlink objects
for i in range(text_fields.Count):
    text_field = text_fields.getByIndex(i)
    # print(text_field)
    # Check if the TextField is a hyperlink by inspecting the target text property
    if hasattr(text_field, 'IsHyperlink') and text_field.IsHyperlink:
        hyperlink_target = text_field.Text
        print(f"Hyperlink target in cell A2: {hyperlink_target}")
        break
else:
    print("No hyperlink found in cell A2.")
