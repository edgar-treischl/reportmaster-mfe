library(jsonlite)


#config
ubb <- FALSE



#Import data
json_data <- jsonlite::fromJSON("src/data/example_data.json")

# Data for one plot only: User pan pick plot:
data <- json_data
data <- data |> dplyr::filter(plot_name == "A51")

# Get set for labels/colors etc
this_set <- unique(data$set)

# Get labels and colors for this set
meta_sets <- jsonlite::fromJSON("src/data/meta_sets.json")
labels <- meta_sets |> dplyr::filter(set == this_set) 

## add plot name 
plot_headers <- jsonlite::fromJSON("src/data/meta_headers.json")

plot_header <- plot_headers |> 
  dplyr::filter(report == "Survey") |> 
  dplyr::filter(plot == "A51") |>
  dplyr::pull(header1)



if (ubb) {
  data$newlable <- data$label_short
  data$newlable <- as.factor(data$newlable)
  
  bold_labels <- sapply(data$newlable, function(x) {
    
    # Wrap the entire label to fit within the axis
    x <- stringr::str_wrap(x, width = 35)
    # Replace Markdown newlines (\n) with HTML <br> tags
    bold_part <- stringr::str_replace_all(x, "\n", "<br>")
  })
  
  data$bold_labels <- bold_labels
  data$bold_labels <- as.factor(data$bold_labels)
  
  
  tmp.p <- ggplot2::ggplot(data, ggplot2::aes(fill = vals, y = anz, x = newlable)) +
    ggplot2::geom_bar(
      stat = 'identity',
      position = ggplot2::position_stack(),
      width = 0.5
    ) +
    ggplot2::geom_label(
      ggplot2::aes(label = paste0(as.character(anz)), group = factor(vals)),
      position = ggplot2::position_stack(vjust = 0.5),
      size = 3.5,
      fill = "white",
      colour = "black"
    ) +
    ggplot2::scale_fill_manual(
      breaks = rev(labels$labels),
      values = rev(labels$colors),
      drop = TRUE,
      labels = function(x) stringr::str_wrap(x, width = 12)  # Wrap legend text
    ) +
    ggplot2::scale_x_discrete(
      guide = ggplot2::guide_axis(n.dodge = 1),
      labels = rev(levels(data$bold_labels)),
      limits = rev(levels(data$newlable))
    ) +
    ggplot2::scale_y_continuous(
      breaks = function(x) scales::pretty_breaks()(x) |> round(),  # Apply rounding to the breaks
      labels = scales::number_format(accuracy = 1)  # Format labels as integers
    )+
    ggplot2::coord_flip() +
    ggplot2::theme_minimal(base_size = 14) +
    ggplot2::theme(
      legend.position = "bottom",
      legend.box.margin = ggplot2::margin(10, 10, 10, 10),
      legend.spacing.y = ggplot2::unit(0.5, "cm"),
      legend.key.size = ggplot2::unit(.75, "lines"),
      legend.text = ggplot2::element_text(size = 12),
      axis.text.x.bottom = ggtext::element_markdown(size = 16),
      axis.text.y.left   = ggtext::element_markdown(hjust = 0)
    ) +
    ggplot2::labs(x = '', y = 'Anzahl', fill = "")
}else {
  data$newlable <- paste0(data$vars, ": ", data$label_short)
  data$newlable <- as.factor(data$newlable)
  
  
  bold_labels <- sapply(data$newlable, function(x) {
    
    # Wrap the entire label to fit within the axis
    x <- stringr::str_wrap(x, width = 45)
    # Replace Markdown newlines (\n) with HTML <br> tags
    x <- stringr::str_replace_all(x, "\n", "<br>")
    # Extract the part before the colon (e.g., "B223c (sus):")
    bold_part <- stringr::str_extract(x, "^[^:]+:")
    # Add bold formatting using Markdown syntax
    bold_part <- paste0("**", bold_part, "**")
    # Extract the part after the colon
    rest_part <- stringr::str_remove(x, "^[^:]+:")
    # Combine the bold part and the rest of the string
    new_label <- paste0(bold_part, rest_part)
  })
  
  data$bold_labels <- bold_labels
  data$bold_labels <- as.factor(data$bold_labels)
  
  tmp.p <- ggplot2::ggplot(data, ggplot2::aes(fill = vals, y = p, x = newlable)) +
    ggplot2::geom_bar(
      stat = 'identity',
      position = ggplot2::position_stack(),
      width = 0.5
    ) +
    ggplot2::geom_label(
      ggplot2::aes(label = ifelse(p > 3,  paste0(label_n, "\n", anz), NA), group = factor(vals)),
      position = ggplot2::position_stack(vjust = 0.5),
      size = 3.5,
      fill = "white",
      colour = "black"
    ) +
    ggplot2::scale_fill_manual(
      breaks = rev(labels$labels),
      values = rev(labels$colors),
      drop = TRUE,
      labels = function(x) stringr::str_wrap(x, width = 7)
    ) +
    ggplot2::scale_x_discrete(guide = ggplot2::guide_axis(n.dodge = 1),
                              labels = rev(levels(data$bold_labels)),
                              limits = rev(levels(data$newlable))
    ) +
    ggplot2::coord_flip() +
    ggplot2::theme_minimal(base_size = 14) +
    ggplot2::theme(
      legend.position = "bottom",
      legend.spacing.y = ggplot2::unit(0.5, "cm"),
      legend.key.size = ggplot2::unit(0.5, "lines"),
      legend.text = ggplot2::element_text(size = 12, lineheight = 0.8),
      axis.text.x.bottom = ggtext::element_markdown(size = 16),
      axis.text.y.left   = ggtext::element_markdown(hjust = 0)
    )+
    ggplot2::labs(x = '', y = 'Prozent', fill = "") +
    ggplot2::guides(fill = ggplot2::guide_legend(nrow = 1))
}

tmp.p
