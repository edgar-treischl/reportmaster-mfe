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

    tmp.p <- ggplot2::ggplot(data, ggplot2::aes(x = "", y = p, fill = vals)) +
      ggplot2::geom_bar(
        stat = "identity",
        position = "stack",
        width = 1
      ) +
      ggplot2::geom_label(
        ggplot2::aes(
          label = ifelse(p > 3, paste0(label_n, "\n", anz), NA),
          group = factor(vals)
        ),
        position = ggplot2::position_stack(vjust = 0.5),
        size = 3.2,
        fill = "white",
        colour = "black",
        lineheight = 0.9
      ) +
      ggplot2::facet_wrap(
        ~ stringr::str_wrap(newlable, width = 60),  # wrap long row labels
        ncol = 1,
        strip.position = "top"
      ) +
      ggplot2::scale_fill_manual(
        breaks = rev(labels$labels),
        values = rev(labels$colors),
        drop = TRUE,
        labels = function(x) stringr::str_wrap(x, width = 15)
      ) +
      ggplot2::scale_y_continuous(
        breaks = function(x) scales::pretty_breaks()(x) |> round(),
        labels = scales::number_format(accuracy = 1)
      ) +
      ggplot2::coord_flip() +
      ggplot2::theme_minimal(base_size = 14) +
      ggplot2::theme(
        legend.position = "bottom",
        legend.box.margin = ggplot2::margin(10, 10, 10, 10),
        legend.spacing.x = ggplot2::unit(0.4, "cm"),
        legend.spacing.y = ggplot2::unit(0.4, "cm"),
        legend.key.width = ggplot2::unit(0.8, "lines"),
        legend.key.size = ggplot2::unit(0.7, "lines"),
        legend.text = ggplot2::element_text(size = 10, color = "gray30", lineheight = 0.9),

        # remove useless x-axis (since x = "")
        axis.text.y = ggplot2::element_blank(),
        axis.ticks.y = ggplot2::element_blank(),

        axis.text.x = ggplot2::element_text(size = 8, color = "gray70"),
        axis.ticks.x = ggplot2::element_line(color = "gray70", linewidth = 0.3),

        strip.text = ggtext::element_markdown(
          margin = ggplot2::margin(6, 4, 6, 4),
          size = 11,
          face = "bold",
          hjust = 0
        ),

        panel.spacing.y = ggplot2::unit(0.8, "lines"),
        panel.grid.major.y = ggplot2::element_blank(),
        panel.grid.major.x = ggplot2::element_line(color = "gray90", linewidth = 0.3),

        plot.margin = ggplot2::margin(10, 15, 10, 15)
      ) +
      ggplot2::labs(
        x = NULL,
        y = "Prozent",
        fill = NULL
      ) +
      ggplot2::guides(
        fill = ggplot2::guide_legend(
          nrow = 1,
          byrow = TRUE
        )
      )